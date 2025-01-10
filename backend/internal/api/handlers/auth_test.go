package handlers

import (
    "bytes"
    "context"
    "encoding/json"
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

func (m *MockAuthService) Register(ctx context.Context, input services.RegisterInput) (*services.AuthResponse, error) {
    args := m.Called(ctx, input)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*services.AuthResponse), args.Error(1)
}

func (m *MockAuthService) Login(ctx context.Context, input services.LoginInput) (*services.AuthResponse, error) {
    args := m.Called(ctx, input)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*services.AuthResponse), args.Error(1)
}

func TestAuthHandler_Register(t *testing.T) {
    gin.SetMode(gin.TestMode)

    t.Run("successful registration", func(t *testing.T) {
        mockService := new(MockAuthService)
        handler := NewAuthHandler(mockService)

        input := services.RegisterInput{
            Email:    "test@example.com",
            Password: "password123",
            Name:     "Test User",
        }

        response := &services.AuthResponse{
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

        var responseBody services.AuthResponse
        err := json.Unmarshal(w.Body.Bytes(), &responseBody)
        assert.NoError(t, err)
        assert.Equal(t, response.Token, responseBody.Token)
        assert.Equal(t, response.User.Email, responseBody.User.Email)

        mockService.AssertExpectations(t)
    })

    t.Run("user already exists", func(t *testing.T) {
        mockService := new(MockAuthService)
        handler := NewAuthHandler(mockService)

        input := services.RegisterInput{
            Email:    "test@example.com",
            Password: "password123",
            Name:     "Test User",
        }

        mockService.On("Register", mock.Anything, input).Return(nil, services.ErrUserExists)

        w := httptest.NewRecorder()
        c, _ := gin.CreateTestContext(w)

        body, _ := json.Marshal(input)
        c.Request, _ = http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
        c.Request.Header.Set("Content-Type", "application/json")

        handler.Register(c)

        assert.Equal(t, http.StatusConflict, w.Code)
        mockService.AssertExpectations(t)
    })

    t.Run("invalid input", func(t *testing.T) {
        mockService := new(MockAuthService)
        handler := NewAuthHandler(mockService)

        input := struct {
            InvalidField string `json:"invalid_field"`
        }{
            InvalidField: "test",
        }

        w := httptest.NewRecorder()
        c, _ := gin.CreateTestContext(w)

        body, _ := json.Marshal(input)
        c.Request, _ = http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
        c.Request.Header.Set("Content-Type", "application/json")

        handler.Register(c)

        assert.Equal(t, http.StatusBadRequest, w.Code)
    })
}

func TestAuthHandler_Login(t *testing.T) {
    gin.SetMode(gin.TestMode)

    t.Run("successful login", func(t *testing.T) {
        mockService := new(MockAuthService)
        handler := NewAuthHandler(mockService)

        input := services.LoginInput{
            Email:    "test@example.com",
            Password: "password123",
        }

        response := &services.AuthResponse{
            Token: "test-token",
            User: &models.User{
                Email: input.Email,
                Name:  "Test User",
            },
        }

        mockService.On("Login", mock.Anything, input).Return(response, nil)

        w := httptest.NewRecorder()
        c, _ := gin.CreateTestContext(w)

        body, _ := json.Marshal(input)
        c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
        c.Request.Header.Set("Content-Type", "application/json")

        handler.Login(c)

        assert.Equal(t, http.StatusOK, w.Code)

        var responseBody services.AuthResponse
        err := json.Unmarshal(w.Body.Bytes(), &responseBody)
        assert.NoError(t, err)
        assert.Equal(t, response.Token, responseBody.Token)
        assert.Equal(t, response.User.Email, responseBody.User.Email)

        mockService.AssertExpectations(t)
    })

    t.Run("invalid credentials", func(t *testing.T) {
        mockService := new(MockAuthService)
        handler := NewAuthHandler(mockService)

        input := services.LoginInput{
            Email:    "test@example.com",
            Password: "wrongpassword",
        }

        mockService.On("Login", mock.Anything, input).Return(nil, services.ErrInvalidCredentials)

        w := httptest.NewRecorder()
        c, _ := gin.CreateTestContext(w)

        body, _ := json.Marshal(input)
        c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
        c.Request.Header.Set("Content-Type", "application/json")

        handler.Login(c)

        assert.Equal(t, http.StatusUnauthorized, w.Code)
        mockService.AssertExpectations(t)
    })

    t.Run("invalid input", func(t *testing.T) {
        mockService := new(MockAuthService)
        handler := NewAuthHandler(mockService)

        input := struct {
            InvalidField string `json:"invalid_field"`
        }{
            InvalidField: "test",
        }

        w := httptest.NewRecorder()
        c, _ := gin.CreateTestContext(w)

        body, _ := json.Marshal(input)
        c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
        c.Request.Header.Set("Content-Type", "application/json")

        handler.Login(c)

        assert.Equal(t, http.StatusBadRequest, w.Code)
    })
}

func TestAuthHandler_GetMe(t *testing.T) {
    gin.SetMode(gin.TestMode)

    t.Run("authenticated user", func(t *testing.T) {
        mockService := new(MockAuthService)
        handler := NewAuthHandler(mockService)

        user := &models.User{
            Email: "test@example.com",
            Name:  "Test User",
        }

        w := httptest.NewRecorder()
        c, _ := gin.CreateTestContext(w)
        c.Set("user", user)

        handler.GetMe(c)

        assert.Equal(t, http.StatusOK, w.Code)

        var response struct {
            User *models.User `json:"user"`
        }
        err := json.Unmarshal(w.Body.Bytes(), &response)
        assert.NoError(t, err)
        assert.Equal(t, user.Email, response.User.Email)
        assert.Equal(t, user.Name, response.User.Name)
    })

    t.Run("unauthenticated user", func(t *testing.T) {
        mockService := new(MockAuthService)
        handler := NewAuthHandler(mockService)

        w := httptest.NewRecorder()
        c, _ := gin.CreateTestContext(w)

        handler.GetMe(c)

        assert.Equal(t, http.StatusUnauthorized, w.Code)
    })
}