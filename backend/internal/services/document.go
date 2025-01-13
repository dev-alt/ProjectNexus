﻿// internal/services/document.go
package services

import (
	"context"
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
	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
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
	// Check project access
	hasAccess, err := s.hasProjectAccess(ctx, input.ProjectID, userID)
	if err != nil {
		if err == repository.ErrNotFound {
			return nil, errors.ErrProjectNotFound
		}
		return nil, err
	}
	if !hasAccess {
		return nil, errors.ErrUnauthorized
	}

	// Create document
	doc := &models.Document{
		ProjectID: input.ProjectID,
		Title:     input.Title,
		Type:      input.Type,
		Content:   input.Content,
		Version:   1,
		CreatedBy: userID,
	}

	if err := s.documentRepo.Create(ctx, doc); err != nil {
		return nil, err
	}

	return doc, nil
}

// GetDocument retrieves a document by ID
func (s *documentService) GetDocument(ctx context.Context, id string, userID string) (*models.Document, error) {
	doc, err := s.documentRepo.GetByID(ctx, id)
	if err != nil {
		if err == repository.ErrNotFound {
			return nil, errors.ErrDocumentNotFound
		}
		return nil, err
	}

	// Check project access
	hasAccess, err := s.hasProjectAccess(ctx, doc.ProjectID, userID)
	if err != nil {
		return nil, err
	}
	if !hasAccess {
		return nil, errors.ErrUnauthorized
	}

	return doc, nil
}

// UpdateDocument updates a document
func (s *documentService) UpdateDocument(ctx context.Context, id string, input models.UpdateDocumentInput, userID string) (*models.Document, error) {
	doc, err := s.GetDocument(ctx, id, userID)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if input.Title != nil {
		doc.Title = *input.Title
	}
	if input.Type != nil {
		doc.Type = *input.Type
	}
	if input.Content != nil {
		doc.Content = *input.Content
	}

	if err := s.documentRepo.Update(ctx, doc); err != nil {
		return nil, err
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
	hasAccess, err := s.hasProjectAccess(ctx, projectID, userID)
	if err != nil {
		if err == repository.ErrNotFound {
			return nil, errors.ErrProjectNotFound
		}
		return nil, err
	}
	if !hasAccess {
		return nil, errors.ErrUnauthorized
	}

	return s.documentRepo.GetByProject(ctx, projectID)
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
