package tests

import (
	"context"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"projectnexus/internal/services"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock repository
type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) Create(ctx context.Context, user *models.User) error {
	args := m.Called(ctx, user)
	return args.Error(0)
}

func (m *MockUserRepository) GetByID(ctx context.Context, id string) (*models.User, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockUserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	args := m.Called(ctx, email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockUserRepository) Update(ctx context.Context, user *models.User) error {
	args := m.Called(ctx, user)
	return args.Error(0)
}

func TestAuthService_Register(t *testing.T) {
	mockRepo := new(MockUserRepository)
	authService := services.NewAuthService(mockRepo, "test-secret")

	ctx := context.Background()
	input := models.RegisterInput{
		Email:    "test@example.com",
		Password: "password123",
		Name:     "Test User",
	}

	t.Run("successful registration", func(t *testing.T) {
		// Clear previous mock calls
		mockRepo = new(MockUserRepository)
		authService = services.NewAuthService(mockRepo, "test-secret")

		mockRepo.On("GetByEmail", ctx, input.Email).Return(nil, nil)
		mockRepo.On("Create", ctx, mock.AnythingOfType("*models.User")).Return(nil)

		response, err := authService.Register(ctx, input)

		assert.NoError(t, err)
		assert.NotNil(t, response)
		assert.NotEmpty(t, response.Token)
		assert.Equal(t, input.Email, response.User.Email)
		assert.Equal(t, input.Name, response.User.Name)
		mockRepo.AssertExpectations(t)
	})

	t.Run("user already exists", func(t *testing.T) {
		// Clear previous mock calls
		mockRepo = new(MockUserRepository)
		authService = services.NewAuthService(mockRepo, "test-secret")

		existingUser := &models.User{Email: input.Email}
		// This is what changed - we're returning nil for error since we found the user
		mockRepo.On("GetByEmail", ctx, input.Email).Return(existingUser, nil).Once()

		response, err := authService.Register(ctx, input)

		assert.Error(t, err)
		assert.Equal(t, repository.ErrUserExists, err)
		assert.Nil(t, response)
		mockRepo.AssertExpectations(t)
	})
}
