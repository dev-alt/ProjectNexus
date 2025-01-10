// internal/api/routes/routes.go
package routes

import (
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/mongo"
    "projectnexus/internal/api/handlers"
    "projectnexus/internal/middleware"
    mongorepo "projectnexus/internal/repository/mongo"
    "projectnexus/internal/services"
    "projectnexus/internal/config"
)

// SetupRouter initializes the router and registers all routes
func SetupRouter(db *mongo.Database) *gin.Engine {
    router := gin.Default()

    // Initialize repositories
    userRepo := mongorepo.NewUserRepository(db)

    // Initialize services
    config := config.Load()
    authService := services.NewAuthService(userRepo, config.JWTSecret)

    // Initialize handlers
    authHandler := handlers.NewAuthHandler(authService)

    // Global middleware
    router.Use(middleware.CORSMiddleware())

    // Health check
    router.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status": "healthy",
            "service": "projectnexus-api",
        })
    })

    // API v1 routes
    v1 := router.Group("/api/v1")
    {
        // Auth routes (public)
        auth := v1.Group("/auth")
        {
            auth.POST("/register", authHandler.Register)
            auth.POST("/login", authHandler.Login)
        }

        // Protected routes
        protected := v1.Group("")
        protected.Use(middleware.AuthMiddleware(authService))
        {
            // User routes
            user := protected.Group("/users")
            {
                user.GET("/me", authHandler.GetMe)
                // Add more user routes here
            }

            // Project routes (to be implemented)
            projects := protected.Group("/projects")
            projects.GET("/", func(c *gin.Context) {
                c.JSON(200, gin.H{"message": "Project endpoints coming soon"})
            })

            // Document routes (to be implemented)
            documents := protected.Group("/documents")
            documents.GET("/", func(c *gin.Context) {
                c.JSON(200, gin.H{"message": "Document endpoints coming soon"})
            })
        }
    }

    return router
}