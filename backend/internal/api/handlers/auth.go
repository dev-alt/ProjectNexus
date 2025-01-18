package handlers

import (
	"errors"
	"log"
	"net/http"
	errs "projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/services"
	"strings"

	"github.com/gin-gonic/gin"
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
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.authService.Register(c.Request.Context(), input)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrUserExists): // Updated reference
			c.JSON(http.StatusConflict, gin.H{"error": "user already exists"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register user"})
		}
		return
	}

	c.JSON(http.StatusCreated, response)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input models.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.authService.Login(c.Request.Context(), input)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrInvalidCredentials): // Updated reference
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to login"})
		}
		return
	}

	c.JSON(http.StatusOK, response)
}

// GetMe Optional: Add a handler to get the current user's information
func (h *AuthHandler) GetMe(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

// RefreshToken handles token refresh requests
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
		return
	}

	token = strings.TrimPrefix(token, "Bearer ")

	response, err := h.authService.RefreshToken(c.Request.Context(), token)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrInvalidToken):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		case errors.Is(err, errs.ErrTokenExpired):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token expired"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to refresh token"})
		}
		return
	}

	c.JSON(http.StatusOK, response)
}

// Logout handles user logout requests
func (h *AuthHandler) Logout(c *gin.Context) {
	// Get token from Authorization header
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
		return
	}

	// Remove "Bearer " prefix if present
	token = strings.TrimPrefix(token, "Bearer ")

	// Call service to handle logout
	err := h.authService.Logout(c.Request.Context(), token)
	if err != nil {
		// Add logging for debugging
		log.Printf("Logout error: %v\n", err)

		switch {
		case errors.Is(err, errs.ErrInvalidToken):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		case errors.Is(err, errs.ErrTokenExpired):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token expired"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to logout"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "successfully logged out"})
}
