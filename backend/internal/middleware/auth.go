package middleware

import (
    "strings"
    "github.com/gin-gonic/gin"
    "projectnexus/internal/services"
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
            c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
            return
        }

        // Set user in context for later use
        c.Set("user", user)
        c.Next()
    }
}