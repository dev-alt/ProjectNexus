// Package routes internal/api/routes/routes.go
package routes

import (
	"projectnexus/internal/api/handlers"
	"projectnexus/internal/config"
	"projectnexus/internal/middleware"
	"projectnexus/internal/repository"
	mongorepo "projectnexus/internal/repository/mongo"
	"projectnexus/internal/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupRouter(router *gin.Engine, db *mongo.Database, tokenStore repository.TokenStore) {
	// Initialize repositories
	userRepo := mongorepo.NewUserRepository(db)
	projectRepo := mongorepo.NewProjectRepository(db)
	documentRepo := mongorepo.NewDocumentRepository(db)
	teamRepo := mongorepo.NewTeamRepository(db)
	teamMemberRepo := mongorepo.NewTeamMemberRepository(db)
	mockupRepo := mongorepo.NewMockupRepository(db)

	// Initialize services
	config_ := config.Load()
	authService := services.NewAuthService(userRepo, config_.JWTSecret, tokenStore)
	projectService := services.NewProjectService(projectRepo, userRepo)
	documentService := services.NewDocumentService(documentRepo, projectRepo)
	teamService := services.NewTeamService(teamRepo, teamMemberRepo, projectRepo, userRepo)
	mockupService := services.NewMockupService(mockupRepo, projectRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	projectHandler := handlers.NewProjectHandler(projectService)
	documentHandler := handlers.NewDocumentHandler(documentService)
	teamHandler := handlers.NewTeamHandler(teamService)
	mockupHandler := handlers.NewMockupHandler(mockupService)

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
			auth.POST("/refresh", authHandler.RefreshToken)
			auth.POST("/logout", authHandler.Logout)
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

				// Team routes - Using :id consistently
				team := projects.Group("/:id/team")
				{
					team.GET("", teamHandler.GetProjectTeam)
					team.POST("", teamHandler.AddTeamMember)
					team.GET("/:memberId", teamHandler.GetTeamMember)
					team.PUT("/:memberId", teamHandler.UpdateTeamMember)
					team.DELETE("/:memberId", teamHandler.RemoveTeamMember)
				}
			}
			// Teams routes
			teams := protected.Group("/teams")
			{
				teams.POST("", teamHandler.CreateTeam)
				teams.GET("", teamHandler.GetAllTeams)
				teams.GET("/:id", teamHandler.GetTeam)
				teams.PUT("/:id", teamHandler.UpdateTeam)
				teams.DELETE("/:id", teamHandler.DeleteTeam)

				// Team members routes
				members := teams.Group("/:id/members")
				{
					members.GET("", teamHandler.GetTeamMembers)
					members.POST("", teamHandler.AddTeamMember)
					members.GET("/:memberId", teamHandler.GetTeamMember)
					members.PUT("/:memberId", teamHandler.UpdateTeamMember)
					members.DELETE("/:memberId", teamHandler.RemoveTeamMember)
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
					documents.GET("/project/:id", documentHandler.GetProjectDocuments)
				}
			}
			mockups := protected.Group("/mockups")
			{
				mockups.POST("", mockupHandler.CreateMockup)
				mockups.GET("", mockupHandler.ListMockups)
				mockups.GET("/:id", mockupHandler.GetMockup)
				mockups.PUT("/:id", mockupHandler.UpdateMockup)
				mockups.DELETE("/:id", mockupHandler.DeleteMockup)
			}
		}
	}
}
