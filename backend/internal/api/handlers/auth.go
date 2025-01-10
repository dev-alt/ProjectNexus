package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "projectnexus/internal/services"
)

type AuthHandler struct {
    authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
    return &AuthHandler{
        authService: authService,
    }
}

func (h *AuthHandler) Register(c *gin.Context) {
    var input services.RegisterInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    response, err := h.authService.Register(c.Request.Context(), input)
    if err != nil {
        switch err {
        case services.ErrUserExists:
            c.JSON(http.StatusConflict, gin.H{"error": "user already exists"})
        default:
            c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register user"})
        }
        return
    }

    c.JSON(http.StatusCreated, response)
}

func (h *AuthHandler) Login(c *gin.Context) {
    var input services.LoginInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    response, err := h.authService.Login(c.Request.Context(), input)
    if err != nil {
        switch err {
        case services.ErrInvalidCredentials:
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
        default:
            c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to login"})
        }
        return
    }

    c.JSON(http.StatusOK, response)
}

// Optional: Add a handler to get the current user's information
func (h *AuthHandler) GetMe(c *gin.Context) {
    user, exists := c.Get("user")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"user": user})
}