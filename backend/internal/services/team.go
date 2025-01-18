// Package services internal/services/team.go
package services

import (
	"context"
	stderrors "errors"
	"fmt"
	"projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"projectnexus/internal/repository/mongo"
	"time"
)

type TeamService interface {
	AddTeamMember(ctx context.Context, projectID string, input models.AddTeamMemberInput, adderID string) (*models.TeamMember, error)
	UpdateTeamMember(ctx context.Context, projectID, memberID string, input models.UpdateTeamMemberInput, updaterID string) (*models.TeamMember, error)
	RemoveTeamMember(ctx context.Context, projectID, memberID string, removerID string) error // Make sure error is here
	GetTeamMember(ctx context.Context, projectID, memberID string) (*models.TeamMember, error)
	GetProjectTeam(ctx context.Context, projectID string) ([]*models.TeamMember, error)
	CreateTeam(ctx context.Context, input models.CreateTeamInput, id string) (interface{}, interface{})
	GetAllTeams(ctx context.Context) (interface{}, interface{})
	GetTeamByID(ctx context.Context, id string) (interface{}, interface{})
	UpdateTeam(ctx context.Context, id string, input models.UpdateTeamInput) (interface{}, interface{})
	DeleteTeam(ctx context.Context, id string) interface{}
	GetTeamMembers(ctx context.Context, id string) (interface{}, interface{})
}

type teamService struct {
	teamRepo       repository.TeamRepository
	teamMemberRepo repository.TeamMemberRepository
	projectRepo    repository.ProjectRepository
	userRepo       repository.UserRepository
}

func NewTeamService(teamRepo *mongo.TeamRepository, teamMemberRepo *mongo.TeamMemberRepository, projectRepo repository.ProjectRepository, userRepo repository.UserRepository) TeamService {
	return &teamService{
		teamRepo:       teamRepo,
		teamMemberRepo: teamMemberRepo,
		projectRepo:    projectRepo,
		userRepo:       userRepo,
	}
}

func (s *teamService) GetAllTeams(ctx context.Context) (interface{}, interface{}) {
	teams, err := s.teamRepo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch teams: %w", err)
	}

	return teams, nil
}

func (s *teamService) CreateTeam(ctx context.Context, input models.CreateTeamInput, id string) (interface{}, interface{}) {
	// Validate input
	if input.Name == "" || input.Description == "" {
		return nil, errors.ErrInvalidInput
	}

	// Create team model
	team := &models.Team{
		ID:          id,
		Name:        input.Name,
		Description: input.Description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Save team to the repository
	err := s.teamRepo.Create(ctx, team)
	if err != nil {
		return nil, fmt.Errorf("failed to create team: %w", err)
	}

	return team, nil
}

func (s *teamService) GetTeamByID(ctx context.Context, id string) (interface{}, interface{}) {
	// Fetch the team by ID from the repository
	team, err := s.teamRepo.GetByID(ctx, id)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return nil, errors.ErrNotFound // Return an appropriate error
		}
		return nil, fmt.Errorf("failed to fetch team by ID: %w", err)
	}

	return team, nil // Return the team
}

func (s *teamService) UpdateTeam(ctx context.Context, id string, input models.UpdateTeamInput) (interface{}, interface{}) {
	// Fetch the existing team
	team, err := s.teamRepo.GetByID(ctx, id)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return nil, errors.ErrNotFound // Team not found
		}
		return nil, fmt.Errorf("failed to fetch team: %w", err) // Other errors
	}

	// Update team fields if they are provided in the input
	if input.Name != nil && *input.Name != "" {
		team.Name = *input.Name
	}

	if input.Description != nil && *input.Description != "" {
		team.Description = *input.Description
	}

	// Update the timestamp for modification
	team.UpdatedAt = time.Now()

	// Save the updated team back to the repository
	if err := s.teamRepo.Update(ctx, team); err != nil {
		return nil, fmt.Errorf("failed to update team: %w", err)
	}

	return team, nil // Return the updated team
}

func (s *teamService) DeleteTeam(ctx context.Context, id string) interface{} {
	// Check if the team exists (optional step)
	_, err := s.teamRepo.GetByID(ctx, id)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return errors.ErrNotFound // Team not found
		}
		return fmt.Errorf("failed to fetch team: %w", err) // Other errors
	}

	// Proceed to delete the team
	if err := s.teamRepo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete team: %w", err)
	}

	// Return a success response
	return "Team successfully deleted"
}
func (s *teamService) GetTeamMembers(ctx context.Context, id string) (interface{}, interface{}) {
	// Check if the team exists
	_, err := s.teamRepo.GetByID(ctx, id)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return nil, errors.ErrNotFound // Return team not found error
		}
		return nil, fmt.Errorf("failed to fetch team: %w", err) // Handle other errors
	}

	// Fetch the team members from the repository
	members, err := s.teamMemberRepo.GetByTeamID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch team members: %w", err)
	}

	// Return the list of members
	return members, nil
}
func (s *teamService) AddTeamMember(ctx context.Context, projectID string, input models.AddTeamMemberInput, adderID string) (*models.TeamMember, error) {
	// Check if project exists and adder has permission
	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
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
		if stderrors.Is(err, errors.ErrNotFound) {
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

	if err := s.teamMemberRepo.Create(ctx, member); err != nil {
		if stderrors.Is(err, errors.ErrAlreadyInTeam) {
			return nil, errors.ErrAlreadyInTeam
		}
		return nil, fmt.Errorf("failed to create team member: %w", err)
	}

	return member, nil
}

func (s *teamService) UpdateTeamMember(ctx context.Context, projectID, memberID string, input models.UpdateTeamMemberInput, updaterID string) (*models.TeamMember, error) {
	// Get project to check permissions
	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return nil, errors.ErrProjectNotFound
		}
		return nil, err
	}

	// Only project owner can update team members
	if project.CreatedBy != updaterID {
		return nil, errors.ErrUnauthorized
	}

	// Get team member and verify they belong to this project
	member, err := s.teamRepo.GetByID(ctx, memberID)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}

	// Verify member belongs to the specified project
	if member.ProjectID != projectID {
		return nil, errors.ErrNotFound
	}

	// Cannot modify project owner's role
	if member.UserID == project.CreatedBy {
		return nil, errors.ErrCannotRemoveOwner
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

func (s *teamService) RemoveTeamMember(ctx context.Context, projectID, memberID string, removerID string) error {
	// Check project exists and verify permissions
	project, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return errors.ErrProjectNotFound
		}
		return err
	}

	// Only project owner can remove team members
	if project.CreatedBy != removerID {
		return errors.ErrUnauthorized
	}

	// Get team member and verify they belong to this project
	member, err := s.teamRepo.GetByID(ctx, memberID)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return errors.ErrNotFound
		}
		return err
	}

	// Verify member belongs to the specified project
	if member.ProjectID != projectID {
		return errors.ErrNotFound
	}

	// Cannot remove project owner
	if member.UserID == project.CreatedBy {
		return errors.ErrCannotRemoveOwner
	}

	return s.teamRepo.Delete(ctx, memberID)
}

func (s *teamService) GetTeamMember(ctx context.Context, projectID, memberID string) (*models.TeamMember, error) {
	// Get team member
	member, err := s.teamRepo.GetByID(ctx, memberID)
	if err != nil {
		if stderrors.Is(err, errors.ErrNotFound) {
			return nil, errors.ErrNotFound
		}
		return nil, err
	}

	// Verify member belongs to the specified project
	if member.ProjectID != projectID {
		return nil, errors.ErrNotFound
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
