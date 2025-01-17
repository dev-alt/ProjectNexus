// Package services internal/services/mockup.go
package services

import (
	"context"
	"errors"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
)

type MockupService interface {
	CreateMockup(ctx context.Context, mockup *models.Mockup) error
	GetMockupByID(ctx context.Context, id string) (*models.Mockup, error)
	GetProjectMockups(ctx context.Context, projectID string) ([]*models.Mockup, error)
	UpdateMockup(ctx context.Context, mockup *models.Mockup) error
	DeleteMockup(ctx context.Context, id string) error
	ListMockups(ctx context.Context) ([]*models.Mockup, error)
}

type mockupService struct {
	mockupRepo  repository.MockupRepository
	projectRepo repository.ProjectRepository
}

func NewMockupService(mockupRepo repository.MockupRepository, projectRepo repository.ProjectRepository) MockupService {
	return &mockupService{
		mockupRepo:  mockupRepo,
		projectRepo: projectRepo,
	}
}

func (s *mockupService) CreateMockup(ctx context.Context, mockup *models.Mockup) error {
	// Verify project exists
	_, err := s.projectRepo.GetByID(ctx, mockup.ProjectID)
	if err != nil {
		return errors.New("project not found")
	}

	return s.mockupRepo.Create(ctx, mockup)
}

func (s *mockupService) GetMockupByID(ctx context.Context, id string) (*models.Mockup, error) {
	return s.mockupRepo.GetByID(ctx, id)
}

func (s *mockupService) GetProjectMockups(ctx context.Context, projectID string) ([]*models.Mockup, error) {
	// Verify project exists
	_, err := s.projectRepo.GetByID(ctx, projectID)
	if err != nil {
		return nil, errors.New("project not found")
	}

	return s.mockupRepo.GetByProject(ctx, projectID)
}

func (s *mockupService) UpdateMockup(ctx context.Context, mockup *models.Mockup) error {
	// Verify mockup exists
	existingMockup, err := s.mockupRepo.GetByID(ctx, mockup.ID)
	if err != nil {
		return errors.New("mockup not found")
	}

	// Verify project exists
	_, err = s.projectRepo.GetByID(ctx, mockup.ProjectID)
	if err != nil {
		return errors.New("project not found")
	}

	// Preserve created by and timestamps
	mockup.CreatedBy = existingMockup.CreatedBy
	mockup.CreatedAt = existingMockup.CreatedAt

	return s.mockupRepo.Update(ctx, mockup)
}

func (s *mockupService) DeleteMockup(ctx context.Context, id string) error {
	// Verify mockup exists
	_, err := s.mockupRepo.GetByID(ctx, id)
	if err != nil {
		return errors.New("mockup not found")
	}

	return s.mockupRepo.Delete(ctx, id)
}

func (s *mockupService) ListMockups(ctx context.Context) ([]*models.Mockup, error) {
	// We'll add this method to the repository interface
	return s.mockupRepo.List(ctx)
}
