// Package services internal/services/team.go
package services

import (
	"context"
	stderrors "errors"
	"fmt"
	"projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
)

type TeamService interface {
	AddTeamMember(ctx context.Context, projectID string, input models.AddTeamMemberInput, adderID string) (*models.TeamMember, error)
	UpdateTeamMember(ctx context.Context, memberID string, input models.UpdateTeamMemberInput, updaterID string) (*models.TeamMember, error)
	RemoveTeamMember(ctx context.Context, memberID string, removerID string) error
	GetTeamMember(ctx context.Context, memberID string) (*models.TeamMember, error)
	GetProjectTeam(ctx context.Context, projectID string) ([]*models.TeamMember, error)
}

type teamService struct {
	teamRepo    repository.TeamRepository
	projectRepo repository.ProjectRepository
	userRepo    repository.UserRepository
}

func NewTeamService(teamRepo repository.TeamRepository, projectRepo repository.ProjectRepository, userRepo repository.UserRepository) TeamService {
	return &teamService{
		teamRepo:    teamRepo,
		projectRepo: projectRepo,
		userRepo:    userRepo,
	}
}

func (s *teamService) AddTeamMember(ctx context.Context, projectID string, input models.AddTeamMemberInput, adderID string) (*models.TeamMember, error) {
	// Check if project exists and adder has permission
	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		if stderrors.Is(err, repository.ErrNotFound) {
			return nil, errors.ErrProjectNotFound
		}
		return nil, err
	}

	// Only project owner can add team members
	if project.CreatedBy != adderID {
		return nil, errors.ErrUnauthorized
	}

	// Check if user exists
	user, err := s.userRepo.GetByID(ctx, input.UserID)
	if err != nil {
		if stderrors.Is(err, repository.ErrNotFound) {
			return nil, errors.ErrUserNotFound
		}
		return nil, err
	}

	// Create team member
	member := &models.TeamMember{
		ProjectID: projectID,
		UserID:    user.ID,
		Role:      input.Role,
		Status:    models.TeamMemberStatusActive,
	}

	if err := s.teamRepo.Create(ctx, member); err != nil {
		if stderrors.Is(err, repository.ErrAlreadyInTeam) {
			return nil, errors.ErrAlreadyInTeam
		}
		return nil, fmt.Errorf("failed to create team member: %w", err)
	}

	return member, nil
}

func (s *teamService) UpdateTeamMember(ctx context.Context, memberID string, input models.UpdateTeamMemberInput, updaterID string) (*models.TeamMember, error) {
	// Get team member
	member, err := s.teamRepo.GetByID(ctx, memberID)
	if err != nil {
		if stderrors.Is(err, repository.ErrNotFound) {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}

	// Get project to check permissions
	project, err := s.projectRepo.GetByID(ctx, member.ProjectID)
	if err != nil {
		return nil, err
	}

	// Only project owner can update team members
	if project.CreatedBy != updaterID {
		return nil, errors.ErrUnauthorized
	}

	// Update fields if provided
	if input.Role != nil {
		member.Role = *input.Role
	}
	if input.Status != nil {
		member.Status = *input.Status
	}

	if err := s.teamRepo.Update(ctx, member); err != nil {
		return nil, fmt.Errorf("failed to update team member: %w", err)
	}

	return member, nil
}

func (s *teamService) RemoveTeamMember(ctx context.Context, memberID string, removerID string) error {
	// Get team member
	member, err := s.teamRepo.GetByID(ctx, memberID)
	if err != nil {
		if stderrors.Is(err, repository.ErrNotFound) {
			return errors.ErrNotFound
		}
		return err
	}

	// Get project to check permissions
	project, err := s.projectRepo.GetByID(ctx, member.ProjectID)
	if err != nil {
		return err
	}

	// Only project owner can remove team members
	if project.CreatedBy != removerID {
		return errors.ErrUnauthorized
	}

	// Cannot remove project owner
	if member.UserID == project.CreatedBy {
		return errors.ErrCannotRemoveOwner
	}

	return s.teamRepo.Delete(ctx, memberID)
}

func (s *teamService) GetTeamMember(ctx context.Context, memberID string) (*models.TeamMember, error) {
	member, err := s.teamRepo.GetByID(ctx, memberID)
	if err != nil {
		if stderrors.Is(err, repository.ErrNotFound) {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}

	return member, nil
}

func (s *teamService) GetProjectTeam(ctx context.Context, projectID string) ([]*models.TeamMember, error) {
	members, err := s.teamRepo.GetProjectMembers(ctx, projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get project team members: %w", err)
	}

	return members, nil
}
