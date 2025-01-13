// internal/api/routes/routes.go
package routes

import (
	"projectnexus/internal/api/handlers"
	"projectnexus/internal/config"
	"projectnexus/internal/middleware"
	mongorepo "projectnexus/internal/repository/mongo"
	"projectnexus/internal/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupRouter(router *gin.Engine, db *mongo.Database) {
	// Initialize repositories
	userRepo := mongorepo.NewUserRepository(db)
	projectRepo := mongorepo.NewProjectRepository(db)
	documentRepo := mongorepo.NewDocumentRepository(db)

	// Initialize services
	config_ := config.Load()
	authService := services.NewAuthService(userRepo, config_.JWTSecret)
	projectService := services.NewProjectService(projectRepo, userRepo)
	documentService := services.NewDocumentService(documentRepo, projectRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	projectHandler := handlers.NewProjectHandler(projectService)
	documentHandler := handlers.NewDocumentHandler(documentService)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
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
			}

			// Project routes
			projects := protected.Group("/projects")
			{
				projects.POST("", projectHandler.CreateProject)
				projects.GET("", projectHandler.ListProjects)
				projects.GET("/:id", projectHandler.GetProject)
				projects.PUT("/:id", projectHandler.UpdateProject)
				projects.DELETE("/:id", projectHandler.DeleteProject)
				projects.POST("/:id/team", projectHandler.AddTeamMember)
				projects.DELETE("/:id/team/:memberId", projectHandler.RemoveTeamMember)
			}

			// Document routes
			documents := protected.Group("/documents")
			{
				documents.POST("", documentHandler.CreateDocument)
				documents.GET("", documentHandler.ListDocuments)
				documents.GET("/:id", documentHandler.GetDocument)
				documents.PUT("/:id", documentHandler.UpdateDocument)
				documents.DELETE("/:id", documentHandler.DeleteDocument)
				documents.GET("/:id/versions", documentHandler.GetDocumentVersions)

				// Project-specific document routes
				documents.GET("/project/:projectId", documentHandler.GetProjectDocuments)
			}
		}
	}
}
