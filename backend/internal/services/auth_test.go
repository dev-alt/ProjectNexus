package services

import (
    "context"
    "testing"
    "github.com/stretchr/testify/mock"
    "github.com/stretchr/testify/assert"
    "github.com/dev-alt/projectnexus/backend/internal/models"
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
    authService := NewAuthService(mockRepo, "test-secret")

    ctx := context.Background()
    input := RegisterInput{
        Email:    "test@example.com",
        Password: "password123",
        Name:     "Test User",
    }

    t.Run("successful registration", func(t *testing.T) {
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
        existingUser := &models.User{Email: input.Email}
        mockRepo.On("GetByEmail", ctx, input.Email).Return(existingUser, nil)

        response, err := authService.Register(ctx, input)

        assert.Error(t, err)
        assert.Equal(t, ErrUserExists, err)
        assert.Nil(t, response)
        mockRepo.AssertExpectations(t)
    })
}

func TestAuthService_Login(t *testing.T) {
    mockRepo := new(MockUserRepository)
    authService := NewAuthService(mockRepo, "test-secret")

    ctx := context.Background()
    input := LoginInput{
        Email:    "test@example.com",
        Password: "password123",
    }

    t.Run("successful login", func(t *testing.T) {
        user := &models.User{
            Email: input.Email,
            Name:  "Test User",
        }
        user.SetPassword(input.Password)

        mockRepo.On("GetByEmail", ctx, input.Email).Return(user, nil)

        response, err := authService.Login(ctx, input)

        assert.NoError(t, err)
        assert.NotNil(t, response)
        assert.NotEmpty(t, response.Token)
        assert.Equal(t, user.Email, response.User.Email)
        mockRepo.AssertExpectations(t)
    })

    t.Run("invalid credentials", func(t *testing.T) {
        mockRepo.On("GetByEmail", ctx, input.Email).Return(nil, nil)

        response, err := authService.Login(ctx, input)

        assert.Error(t, err)
        assert.Equal(t, ErrInvalidCredentials, err)
        assert.Nil(t, response)
        mockRepo.AssertExpectations(t)
    })
}

func TestAuthService_ValidateToken(t *testing.T) {
    mockRepo := new(MockUserRepository)
    authService := NewAuthService(mockRepo, "test-secret")

    t.Run("valid token", func(t *testing.T) {
        // Create a user and generate a token
        user := &models.User{
            ID:    "user123",
            Email: "test@example.com",
            Name:  "Test User",
        }

        mockRepo.On("GetByID", mock.Anything, user.ID).Return(user, nil)

        // Generate token
        token, err := authService.generateToken(user)
        assert.NoError(t, err)

        // Validate token
        validatedUser, err := authService.ValidateToken(token)

        assert.NoError(t, err)
        assert.NotNil(t, validatedUser)
        assert.Equal(t, user.ID, validatedUser.ID)
        mockRepo.AssertExpectations(t)
    })

    t.Run("invalid token", func(t *testing.T) {
        validatedUser, err := authService.ValidateToken("invalid-token")

        assert.Error(t, err)
        assert.Nil(t, validatedUser)
    })
}