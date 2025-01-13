// Package services internal/services/project.go
package services

import (
	"context"
	"projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
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
		return nil, errors.ErrInvalidStatus
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
		return nil, errors.ErrProjectNotFound // Use errors.ErrProjectNotFound
	}

	// Check if user is part of the project team
	if !containsString(project.Team, userID) && project.CreatedBy != userID {
		return nil, errors.ErrUnauthorized // Use errors.ErrUnauthorized
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
		return errors.ErrUnauthorized // Use errors.ErrUnauthorized
	}

	return s.projectRepo.Delete(ctx, id)
}

func (s *projectService) ListProjects(ctx context.Context, userID string) ([]*models.Project, error) {
	return s.projectRepo.GetByUser(ctx, userID)
}

func (s *projectService) AddTeamMember(ctx context.Context, projectID string, userID string, adderID string) error {
	project, err := s.GetProject(ctx, projectID, adderID)
	if err != nil {
		return err
	}
	_, err = s.userRepo.GetByID(ctx, userID)
	if err != nil {
		if err == repository.ErrNotFound {
			return errors.ErrUserNotFound
		} else {
			return err
		}
	}
	if containsString(project.Team, userID) {
		return errors.ErrAlreadyInTeam
	}

	project.Team = append(project.Team, userID)
	return s.projectRepo.Update(ctx, project)
}

func (s *projectService) RemoveTeamMember(ctx context.Context, projectID string, userID string, removerID string) error {
	project, err := s.GetProject(ctx, projectID, removerID)
	if err != nil {
		return err
	}

	_, err = s.userRepo.GetByID(ctx, userID)
	if err != nil {
		if err == repository.ErrNotFound {
			return errors.ErrUserNotFound
		} else {
			return err
		}
	}
	// Can't remove the project creator
	if userID == project.CreatedBy {
		return errors.ErrCannotRemoveOwner
	}
	if !containsString(project.Team, userID) {
		return errors.ErrNotInTeam
	}

	project.Team = removeString(project.Team, userID)
	return s.projectRepo.Update(ctx, project)
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

func removeString(slice []string, str string) []string {
	result := make([]string, 0)
	for _, item := range slice {
		if item != str {
			result = append(result, item)
		}
	}
	return result
}

// Define valid project statuses
var validProjectStatuses = map[string]bool{
	"planning":   true,
	"inProgress": true,
	"completed":  true,
	"onHold":     true,
}

// isValidProjectStatus checks if the given status is valid
func isValidProjectStatus(status string) bool {
	return validProjectStatuses[status]
}
