// Package services internal/services/document.go
package services

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
)

type DocumentService interface {
	CreateDocument(ctx context.Context, input models.CreateDocumentInput, userID string) (*models.Document, error)
	GetDocument(ctx context.Context, id string, userID string) (*models.Document, error)
	UpdateDocument(ctx context.Context, id string, input models.UpdateDocumentInput, userID string) (*models.Document, error)
	DeleteDocument(ctx context.Context, id string, userID string) error
	ListDocuments(ctx context.Context, userID string) ([]*models.Document, error)
	GetProjectDocuments(ctx context.Context, projectID string, userID string) ([]*models.Document, error)
	GetDocumentVersions(ctx context.Context, documentID string, userID string) ([]*models.DocumentVersion, error)
}

type documentService struct {
	documentRepo repository.DocumentRepository
	projectRepo  repository.ProjectRepository
}

func NewDocumentService(documentRepo repository.DocumentRepository, projectRepo repository.ProjectRepository) DocumentService {
	return &documentService{
		documentRepo: documentRepo,
		projectRepo:  projectRepo,
	}
}

// Helper function to check if user has access to project
func (s *documentService) hasProjectAccess(ctx context.Context, projectID string, userID string) (bool, error) {
	// Add debug logging
	log.Printf("Checking project access - ProjectID: %s, UserID: %s", projectID, userID)

	if projectID == "" {
		return false, fmt.Errorf("project ID is empty")
	}

	if userID == "" {
		return false, fmt.Errorf("user ID is empty")
	}

	// Validate ObjectID format
	if _, err := primitive.ObjectIDFromHex(projectID); err != nil {
		log.Printf("Invalid project ID format: %v", err)
		return false, errors.ErrProjectNotFound
	}

	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		log.Printf("Error fetching project: %v", err)
		return false, err
	}

	// Check if user is project creator or team member
	if project.CreatedBy == userID {
		return true, nil
	}

	for _, memberID := range project.Team {
		if memberID == userID {
			return true, nil
		}
	}

	return false, nil
}

// CreateDocument creates a new document
func (s *documentService) CreateDocument(ctx context.Context, input models.CreateDocumentInput, userID string) (*models.Document, error) {
	// Add input validation logging
	log.Printf("Creating document - Input: %+v, UserID: %s", input, userID)

	if userID == "" {
		return nil, errors.ErrUnauthorized
	}

	// Validate input
	if err := input.Validate(); err != nil {
		log.Printf("Input validation failed: %v", err)
		return nil, fmt.Errorf("invalid input: %w", err)
	}

	// Check project access
	hasAccess, err := s.hasProjectAccess(ctx, input.ProjectID, userID)
	if err != nil {
		if err == errors.ErrProjectNotFound {
			return nil, errors.ErrProjectNotFound
		}
		return nil, fmt.Errorf("failed to check project access: %w", err)
	}
	if !hasAccess {
		return nil, errors.ErrUnauthorized
	}

	doc := &models.Document{
		ProjectID: input.ProjectID,
		Title:     input.Title,
		Type:      input.Type,
		Content:   input.Content,
		Version:   1,
		Status:    input.Status,
		CreatedBy: userID,
	}

	if err := s.documentRepo.Create(ctx, doc); err != nil {
		log.Printf("Error creating document: %v", err)
		return nil, fmt.Errorf("failed to create document: %w", err)
	}

	return doc, nil
}

// GetDocument retrieves a document by ID
func (s *documentService) GetDocument(ctx context.Context, id string, userID string) (*models.Document, error) {
	// Add logging
	log.Printf("Getting document - ID: %s, UserID: %s", id, userID)

	// Validate ObjectID format
	if _, err := primitive.ObjectIDFromHex(id); err != nil {
		log.Printf("Invalid document ID format: %v", err)
		return nil, errors.ErrDocumentNotFound
	}

	doc, err := s.documentRepo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("Document not found: %s", id)
			return nil, errors.ErrDocumentNotFound
		}
		log.Printf("Error fetching document: %v", err)
		return nil, err
	}

	// Check project access
	project, err := s.projectRepo.GetByID(ctx, doc.ProjectID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("Project not found for document: %s", doc.ProjectID)
			return nil, errors.ErrProjectNotFound
		}
		log.Printf("Error fetching project: %v", err)
		return nil, err
	}

	// Check if user is project creator or team member
	hasAccess := project.CreatedBy == userID
	if !hasAccess {
		for _, memberID := range project.Team {
			if memberID == userID {
				hasAccess = true
				break
			}
		}
	}

	if !hasAccess {
		log.Printf("User %s not authorized to access document %s", userID, id)
		return nil, errors.ErrUnauthorized
	}

	return doc, nil
}

// UpdateDocument updates a document
func (s *documentService) UpdateDocument(ctx context.Context, id string, input models.UpdateDocumentInput, userID string) (*models.Document, error) {
	// Add debug logging
	log.Printf("Updating document - ID: %s, UserID: %s, Input: %+v", id, userID, input)

	// Get existing document
	doc, err := s.GetDocument(ctx, id, userID)
	if err != nil {
		log.Printf("Failed to get existing document: %v", err)
		return nil, err
	}

	// Update fields if provided
	if input.Title != nil {
		doc.Title = *input.Title
	}
	if input.Type != nil {
		if !input.Type.IsValid() {
			return nil, fmt.Errorf("invalid document type: %s", *input.Type)
		}
		doc.Type = *input.Type
	}
	if input.Content != nil {
		doc.Content = *input.Content
	}
	if input.Status != nil {
		doc.Status = *input.Status
	}
	// Ensure CreatedBy is still set
	doc.CreatedBy = userID

	if err := s.documentRepo.Update(ctx, doc); err != nil {
		log.Printf("Failed to update document in repository: %v", err)
		return nil, fmt.Errorf("failed to update document: %w", err)
	}

	return doc, nil
}

// DeleteDocument deletes a document
func (s *documentService) DeleteDocument(ctx context.Context, id string, userID string) error {
	doc, err := s.GetDocument(ctx, id, userID)
	if err != nil {
		return err
	}

	// Only document creator or project creator can delete documents
	project, err := s.projectRepo.GetByID(ctx, doc.ProjectID)
	if err != nil {
		return err
	}

	if doc.CreatedBy != userID && project.CreatedBy != userID {
		return errors.ErrUnauthorized
	}

	return s.documentRepo.Delete(ctx, id)
}

// ListDocuments lists all documents accessible to a user
func (s *documentService) ListDocuments(ctx context.Context, userID string) ([]*models.Document, error) {
	// Get all projects the user has access to
	projects, err := s.projectRepo.GetByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	var allDocs []*models.Document
	for _, project := range projects {
		docs, err := s.documentRepo.GetByProject(ctx, project.ID)
		if err != nil {
			return nil, err
		}
		allDocs = append(allDocs, docs...)
	}

	return allDocs, nil
}

// GetProjectDocuments gets all documents in a project
func (s *documentService) GetProjectDocuments(ctx context.Context, projectID string, userID string) ([]*models.Document, error) {
	log.Printf("Getting project documents - ProjectID: %s, UserID: %s", projectID, userID)

	// Validate project ID
	if _, err := primitive.ObjectIDFromHex(projectID); err != nil {
		log.Printf("Invalid project ID format: %v", err)
		return nil, errors.ErrProjectNotFound
	}

	// Check project access
	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("Project not found: %s", projectID)
			return nil, errors.ErrProjectNotFound
		}
		log.Printf("Error fetching project: %v", err)
		return nil, err
	}

	// Check if user has access
	hasAccess := project.CreatedBy == userID
	if !hasAccess {
		for _, memberID := range project.Team {
			if memberID == userID {
				hasAccess = true
				break
			}
		}
	}

	if !hasAccess {
		log.Printf("User %s not authorized to access project %s", userID, projectID)
		return nil, errors.ErrUnauthorized
	}

	// Get project documents
	docs, err := s.documentRepo.GetByProject(ctx, projectID)
	if err != nil {
		log.Printf("Error fetching project documents: %v", err)
		return nil, err
	}

	return docs, nil
}

// GetDocumentVersions gets the version history of a document
func (s *documentService) GetDocumentVersions(ctx context.Context, documentID string, userID string) ([]*models.DocumentVersion, error) {
	// Check document access
	_, err := s.GetDocument(ctx, documentID, userID)
	if err != nil {
		return nil, err
	}

	versions, err := s.documentRepo.GetVersions(ctx, documentID)
	if err != nil {
		return nil, err
	}

	return versions, nil
}
