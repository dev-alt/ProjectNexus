package services

import (
	"context"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"testing"
)

// Mock repositories
type MockDocumentRepository struct {
	mock.Mock
}

func (m *MockDocumentRepository) Create(ctx context.Context, doc *models.Document) error {
	args := m.Called(ctx, doc)
	return args.Error(0)
}

func (m *MockDocumentRepository) CreateVersion(ctx context.Context, version *models.DocumentVersion) error {
	args := m.Called(ctx, version)
	return args.Error(0)
}

func (m *MockDocumentRepository) GetByID(ctx context.Context, id string) (*models.Document, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Document), args.Error(1)
}

func (m *MockDocumentRepository) GetByProject(ctx context.Context, projectID string) ([]*models.Document, error) {
	args := m.Called(ctx, projectID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*models.Document), args.Error(1)
}

func (m *MockDocumentRepository) Update(ctx context.Context, doc *models.Document) error {
	args := m.Called(ctx, doc)
	return args.Error(0)
}

func (m *MockDocumentRepository) Delete(ctx context.Context, id string) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func (m *MockDocumentRepository) GetVersions(ctx context.Context, documentID string) ([]*models.DocumentVersion, error) {
	args := m.Called(ctx, documentID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*models.DocumentVersion), args.Error(1)
}

type MockProjectRepository struct {
	mock.Mock
}

func (m *MockProjectRepository) Create(ctx context.Context, project *models.Project) error {
	args := m.Called(ctx, project)
	return args.Error(0)
}

func (m *MockProjectRepository) GetByID(ctx context.Context, id string) (*models.Project, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Project), args.Error(1)
}

func (m *MockProjectRepository) GetByUser(ctx context.Context, userID string) ([]*models.Project, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*models.Project), args.Error(1)
}

func (m *MockProjectRepository) Update(ctx context.Context, project *models.Project) error {
	args := m.Called(ctx, project)
	return args.Error(0)
}

func (m *MockProjectRepository) Delete(ctx context.Context, id string) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func (m *MockProjectRepository) List(ctx context.Context, filter interface{}) ([]*models.Project, error) {
	args := m.Called(ctx, filter)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*models.Project), args.Error(1)
}

func TestDocumentService_GetDocument(t *testing.T) {
	ctx := context.Background()
	mockDocRepo := new(MockDocumentRepository)
	mockProjRepo := new(MockProjectRepository)
	service := NewDocumentService(mockDocRepo, mockProjRepo)

	testDoc := &models.Document{
		ID:        "doc1",
		ProjectID: "proj1",
		Title:     "Test Document",
		CreatedBy: "user1",
	}

	testProject := &models.Project{
		ID:        "proj1",
		CreatedBy: "user1",
		Team:      []string{"user1", "user2"},
	}

	t.Run("successful get", func(t *testing.T) {
		mockDocRepo.On("GetByID", ctx, "doc1").Return(testDoc, nil)
		mockProjRepo.On("GetByID", ctx, "proj1").Return(testProject, nil)

		doc, err := service.GetDocument(ctx, "doc1", "user1")
		assert.NoError(t, err)
		assert.Equal(t, testDoc, doc)
	})

	t.Run("document not found", func(t *testing.T) {
		mockDocRepo.On("GetByID", ctx, "nonexistent").Return(nil, repository.ErrNotFound)

		doc, err := service.GetDocument(ctx, "nonexistent", "user1")
		assert.Error(t, err)
		assert.Equal(t, errors.ErrDocumentNotFound, err)
		assert.Nil(t, doc)
	})

	t.Run("unauthorized access", func(t *testing.T) {
		mockDocRepo.On("GetByID", ctx, "doc1").Return(testDoc, nil)
		mockProjRepo.On("GetByID", ctx, "proj1").Return(testProject, nil)

		doc, err := service.GetDocument(ctx, "doc1", "unauthorized")
		assert.Error(t, err)
		assert.Equal(t, errors.ErrUnauthorized, err)
		assert.Nil(t, doc)
	})
}

func TestDocumentService_ListDocuments(t *testing.T) {
	ctx := context.Background()
	mockDocRepo := new(MockDocumentRepository)
	mockProjRepo := new(MockProjectRepository)
	service := NewDocumentService(mockDocRepo, mockProjRepo)

	testProjects := []*models.Project{
		{ID: "proj1", CreatedBy: "user1"},
		{ID: "proj2", CreatedBy: "user1"},
	}

	testDocs1 := []*models.Document{
		{ID: "doc1", ProjectID: "proj1", Title: "Doc 1"},
		{ID: "doc2", ProjectID: "proj1", Title: "Doc 2"},
	}

	testDocs2 := []*models.Document{
		{ID: "doc3", ProjectID: "proj2", Title: "Doc 3"},
	}

	mockProjRepo.On("GetByUser", ctx, "user1").Return(testProjects, nil)
	mockDocRepo.On("GetByProject", ctx, "proj1").Return(testDocs1, nil)
	mockDocRepo.On("GetByProject", ctx, "proj2").Return(testDocs2, nil)

	docs, err := service.ListDocuments(ctx, "user1")
	assert.NoError(t, err)
	assert.Len(t, docs, 3)
}

func TestDocumentService_GetProjectDocuments(t *testing.T) {
	ctx := context.Background()
	mockDocRepo := new(MockDocumentRepository)
	mockProjRepo := new(MockProjectRepository)
	service := NewDocumentService(mockDocRepo, mockProjRepo)

	testProject := &models.Project{
		ID:        "proj1",
		CreatedBy: "user1",
		Team:      []string{"user1", "user2"},
	}

	testDocs := []*models.Document{
		{ID: "doc1", ProjectID: "proj1", Title: "Doc 1"},
		{ID: "doc2", ProjectID: "proj1", Title: "Doc 2"},
	}

	t.Run("successful get", func(t *testing.T) {
		mockProjRepo.On("GetByID", ctx, "proj1").Return(testProject, nil)
		mockDocRepo.On("GetByProject", ctx, "proj1").Return(testDocs, nil)

		docs, err := service.GetProjectDocuments(ctx, "proj1", "user1")
		assert.NoError(t, err)
		assert.Equal(t, testDocs, docs)
	})

	t.Run("unauthorized access", func(t *testing.T) {
		mockProjRepo.On("GetByID", ctx, "proj1").Return(testProject, nil)

		docs, err := service.GetProjectDocuments(ctx, "proj1", "unauthorized")
		assert.Error(t, err)
		assert.Equal(t, errors.ErrUnauthorized, err)
		assert.Nil(t, docs)
	})
}
