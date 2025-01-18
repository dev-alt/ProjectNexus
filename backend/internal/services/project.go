// Package services internal/services/project.go
package services

import (
	"context"
	"errors" // Standard library for `errors.Is`
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	errs "projectnexus/internal/errors"
	"projectnexus/internal/models"     // For project models
	"projectnexus/internal/repository" // For common errors
	"time"
)

type ProjectService interface {
	CreateProject(ctx context.Context, input models.CreateProjectInput, userID string) (*models.Project, error)
	GetProject(ctx context.Context, id string, userID string) (*models.Project, error)
	UpdateProject(ctx context.Context, id string, input models.UpdateProjectInput, userID string) (*models.Project, error)
	DeleteProject(ctx context.Context, id string, userID string) error
	ListProjects(ctx context.Context, userID string) ([]*models.Project, error)
	AddTeamMember(ctx context.Context, projectID string, userID string, adderID string) error
	RemoveTeamMember(ctx context.Context, projectID string, userID string, removerID string) error
}

type projectService struct {
	projectRepo repository.ProjectRepository
	userRepo    repository.UserRepository // Add userRepo
}

func NewProjectService(projectRepo repository.ProjectRepository, userRepo repository.UserRepository) ProjectService {
	return &projectService{
		projectRepo: projectRepo,
		userRepo:    userRepo, // Initialize userRepo
	}
}

func (s *projectService) CreateProject(ctx context.Context, input models.CreateProjectInput, userID string) (*models.Project, error) {
	// Validate status
	if !isValidProjectStatus(string(input.Status)) {
		return nil, errs.ErrInvalidStatus
	}

	project := &models.Project{
		Name:        input.Name,
		Description: input.Description,
		Status:      input.Status,
		Progress:    0,
		Team:        []string{userID},
		CreatedBy:   userID,
	}

	if err := s.projectRepo.Create(ctx, project); err != nil {
		return nil, err
	}

	return project, nil
}
func (s *projectService) GetProject(ctx context.Context, id string, userID string) (*models.Project, error) {
	project, err := s.projectRepo.GetByID(ctx, id)
	if err != nil {
		return nil, errs.ErrProjectNotFound
	}

	// Check if user is part of the project team
	if !containsString(project.Team, userID) && project.CreatedBy != userID {
		return nil, errs.ErrUnauthorized
	}

	return project, nil
}
func (s *projectService) UpdateProject(ctx context.Context, id string, input models.UpdateProjectInput, userID string) (*models.Project, error) {
	project, err := s.GetProject(ctx, id, userID)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if input.Name != nil {
		project.Name = *input.Name
	}
	if input.Description != nil {
		project.Description = *input.Description
	}
	if input.Status != nil {
		project.Status = *input.Status
	}
	if input.Progress != nil {
		project.Progress = *input.Progress
	}

	if err := s.projectRepo.Update(ctx, project); err != nil {
		return nil, err
	}

	return project, nil
}

func (s *projectService) DeleteProject(ctx context.Context, id string, userID string) error {
	project, err := s.GetProject(ctx, id, userID)
	if err != nil {
		return err
	}

	// Only project creator can delete the project
	if project.CreatedBy != userID {
		return errs.ErrUnauthorized
	}

	return s.projectRepo.Delete(ctx, id)
}

func (s *projectService) ListProjects(ctx context.Context, userID string) ([]*models.Project, error) {
	return s.projectRepo.GetByUser(ctx, userID)
}

func (s *projectService) AddTeamMember(ctx context.Context, projectID string, memberID string, adderID string) error {
	log.Printf("Adding team member - ProjectID: %s, MemberID: %s, AdderID: %s", projectID, memberID, adderID)

	// Validate project ID
	if _, err := primitive.ObjectIDFromHex(projectID); err != nil {
		return errs.ErrProjectNotFound
	}

	// Get project
	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return errs.ErrProjectNotFound
		}
		return err
	}

	// Check if adder is project creator
	if project.CreatedBy != adderID {
		log.Printf("User %s is not authorized to add members to project %s", adderID, projectID)
		return errs.ErrUnauthorized
	}

	// Verify member exists
	_, err = s.userRepo.GetByID(ctx, memberID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return errs.ErrUserNotFound
		}
		return err
	}
	// Check if member is already in team
	for _, existingMemberID := range project.Team {
		if existingMemberID == memberID {
			return errs.ErrAlreadyInTeam
		}
	}

	// Add member to team
	project.Team = append(project.Team, memberID)
	project.UpdatedAt = time.Now()

	// Update project
	err = s.projectRepo.Update(ctx, project)
	if err != nil {
		log.Printf("Failed to update project: %v", err)
		return err
	}

	log.Printf("Successfully added member %s to project %s", memberID, projectID)
	return nil
}

func (s *projectService) RemoveTeamMember(ctx context.Context, projectID string, memberID string, removerID string) error {
	log.Printf("Removing team member - ProjectID: %s, MemberID: %s, RemoverID: %s", projectID, memberID, removerID)

	// Validate project ID
	if _, err := primitive.ObjectIDFromHex(projectID); err != nil {
		return errs.ErrProjectNotFound
	}

	// Get project
	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return errs.ErrProjectNotFound
		}
		return err
	}

	// Check if remover is project creator
	if project.CreatedBy != removerID {
		log.Printf("User %s is not authorized to remove members from project %s", removerID, projectID)
		return errs.ErrUnauthorized
	}

	// Cannot remove project creator
	if memberID == project.CreatedBy {
		log.Printf("Attempted to remove project creator %s from project %s", memberID, projectID)
		return errs.ErrCannotRemoveOwner
	}

	// Verify member exists
	_, err = s.userRepo.GetByID(ctx, memberID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return errs.ErrUserNotFound
		}
		return err
	}

	// Check if member is in team
	memberFound := false
	newTeam := make([]string, 0, len(project.Team))
	for _, existingMemberID := range project.Team {
		if existingMemberID == memberID {
			memberFound = true
			continue
		}
		newTeam = append(newTeam, existingMemberID)
	}

	if !memberFound {
		return errs.ErrNotInTeam
	}

	// Update project with new team
	project.Team = newTeam
	project.UpdatedAt = time.Now()

	err = s.projectRepo.Update(ctx, project)
	if err != nil {
		log.Printf("Failed to update project: %v", err)
		return err
	}

	log.Printf("Successfully removed member %s from project %s", memberID, projectID)
	return nil
}

// Helper functions
func containsString(slice []string, str string) bool {
	for _, item := range slice {
		if item == str {
			return true
		}
	}
	return false
}

//func removeString(slice []string, str string) []string {
//	result := make([]string, 0)
//	for _, item := range slice {
//		if item != str {
//			result = append(result, item)
//		}
//	}
//	return result
//}

// Define valid project statuses
var validProjectStatuses = map[string]bool{
	"Planning":    true,
	"In Progress": true,
	"Review":      true,
	"Completed":   true,
}

// isValidProjectStatus checks if the given status is valid
func isValidProjectStatus(status string) bool {
	return validProjectStatuses[status]
}
