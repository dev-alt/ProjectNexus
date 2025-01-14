package middleware

import (
	"github.com/gin-gonic/gin"
	"log"
	"projectnexus/internal/services"
	"strings"
)

func AuthMiddleware(authService services.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "authorization header required"})
			return
		}

		// Extract token from Bearer schema
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid authorization header format"})
			return
		}

		user, err := authService.ValidateToken(parts[1])
		if err != nil {
			log.Printf("Token validation failed: %v", err) // Add logging
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		// Set both user object and userID in context
		c.Set("user", user)
		c.Set("userID", user.ID) // Make sure to set userID specifically

		// Add debug logging
		log.Printf("User authenticated: ID=%s, Email=%s", user.ID, user.Email)

		c.Next()
	}
}
