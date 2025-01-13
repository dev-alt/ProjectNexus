package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"projectnexus/internal/models"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockAuthService implements services.AuthService interface
type MockAuthService struct {
	mock.Mock
}

func (m *MockAuthService) Register(ctx context.Context, input models.RegisterInput) (*models.AuthResponse, error) {
	args := m.Called(ctx, input)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.AuthResponse), args.Error(1)
}

func (m *MockAuthService) Login(ctx context.Context, input models.LoginInput) (*models.AuthResponse, error) {
	args := m.Called(ctx, input)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.AuthResponse), args.Error(1)
}

func (m *MockAuthService) ValidateToken(token string) (*models.User, error) {
	args := m.Called(token)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.User), args.Error(1)
}

func TestAuthHandler_Register(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("successful registration", func(t *testing.T) {
		mockService := new(MockAuthService)
		handler := NewAuthHandler(mockService)

		input := models.RegisterInput{
			Email:    "test@example.com",
			Password: "password123",
			Name:     "Test User",
		}

		response := &models.AuthResponse{
			Token: "test-token",
			User: &models.User{
				Email: input.Email,
				Name:  input.Name,
			},
		}

		mockService.On("Register", mock.Anything, input).Return(response, nil)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		body, _ := json.Marshal(input)
		c.Request, _ = http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
		c.Request.Header.Set("Content-Type", "application/json")

		handler.Register(c)

		assert.Equal(t, http.StatusCreated, w.Code)

		var responseBody models.AuthResponse
		err := json.Unmarshal(w.Body.Bytes(), &responseBody)
		assert.NoError(t, err)
		assert.Equal(t, response.Token, responseBody.Token)
		assert.Equal(t, response.User.Email, responseBody.User.Email)

		mockService.AssertExpectations(t)
	})
}
