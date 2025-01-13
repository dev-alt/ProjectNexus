package middleware

import (
	"context"
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

func TestAuthMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("valid token", func(t *testing.T) {
		mockAuth := new(MockAuthService)
		user := &models.User{ID: "123", Email: "test@example.com"}
		mockAuth.On("ValidateToken", "valid-token").Return(user, nil)

		w := httptest.NewRecorder()
		c, r := gin.CreateTestContext(w)

		r.Use(AuthMiddleware(mockAuth))
		r.GET("/test", func(c *gin.Context) {
			u, exists := c.Get("user")
			assert.True(t, exists)
			assert.Equal(t, user, u)
			c.Status(http.StatusOK)
		})

		c.Request, _ = http.NewRequest(http.MethodGet, "/test", nil)
		c.Request.Header.Set("Authorization", "Bearer valid-token")

		r.ServeHTTP(w, c.Request)

		assert.Equal(t, http.StatusOK, w.Code)
		mockAuth.AssertExpectations(t)
	})
}
