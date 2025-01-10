package middleware

import (
    "net/http"
    "net/http/httptest"
    "testing"
    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "github.com/dev-alt/projectnexus/backend/internal/models"
    "github.com/dev-alt/projectnexus/backend/internal/services"
)

// Mock AuthService
type MockAuthService struct {
    mock.Mock
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

    t.Run("missing authorization header", func(t *testing.T) {
        mockAuth := new(MockAuthService)
        
        w := httptest.NewRecorder()
        c, r := gin.CreateTestContext(w)

        r.Use(AuthMiddleware(mockAuth))
        r.GET("/test", func(c *gin.Context) {
            t.Error("handler should not be called")
        })

        c.Request, _ = http.NewRequest(http.MethodGet, "/test", nil)
        
        r.ServeHTTP(w, c.Request)

        assert.Equal(t, http.StatusUnauthorized, w.Code)
    })

    t.Run("invalid token format", func(t *testing.T) {
        mockAuth := new(MockAuthService)
        
        w := httptest.NewRecorder()
        c, r := gin.CreateTestContext(w)

        r.Use(AuthMiddleware(mockAuth))
        r.GET("/test", func(c *gin.Context) {
            t.Error("handler should not be called")
        })

        c.Request, _ = http.NewRequest(http.MethodGet, "/test", nil)
        c.Request.Header.Set("Authorization", "invalid-format")

        r.ServeHTTP(w, c.Request)

        assert.Equal(t, http.StatusUnauthorized, w.Code)
    })

    t.Run("invalid token", func(t *testing.T) {
        mockAuth := new(MockAuthService)
        mockAuth.On("ValidateToken", "invalid-token").Return(nil, services.ErrInvalidCredentials)

        w := httptest.NewRecorder()
        c, r := gin.CreateTestContext(w)

        r.Use(AuthMiddleware(mockAuth))
        r.GET("/test", func(c *gin.Context) {
            t.Error("handler should not be called")
        })

        c.Request, _ = http.NewRequest(http.MethodGet, "/test", nil)
        c.Request.Header.Set("Authorization", "Bearer invalid-token")

        r.ServeHTTP(w, c.Request)

        assert.Equal(t, http.StatusUnauthorized, w.Code)
        mockAuth.AssertExpectations(t)
    })