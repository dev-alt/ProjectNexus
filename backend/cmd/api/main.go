package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"projectnexus/internal/api/routes"
	"projectnexus/internal/repository/mongo"
)

func main() {
	gin.SetMode(gin.DebugMode)
	// Initialize MongoDB connection
	client, err := mongo.Initialize()
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer mongo.Close()

	// Get database instance
	db := client.Database("projectnexus")

	// Create gin router
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// Configure CORS - MOVED BEFORE ROUTES
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{
		"https://project.chillotters.xyz",
		"http://localhost:3050",
	}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{
		"Origin",
		"Content-Type",
		"Accept",
		"Authorization",
		"X-Requested-With",
	}
	corsConfig.AllowCredentials = true
	r.Use(cors.New(corsConfig))

	// Setup routes AFTER cors
	routes.SetupRouter(r, db)

	// Add non-API routes to the main router
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"message": "API is running on port 8085",
		})
	})

	r.GET("/api/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"data": []map[string]interface{}{
				{
					"id":     1,
					"name":   "Test Project",
					"status": "active",
				},
				{
					"id":     2,
					"name":   "Another Project",
					"status": "planning",
				},
			},
		})
	})

	log.Println("Starting server on :8085")
	if err := r.Run("0.0.0.0:8085"); err != nil {
		log.Fatal("Error starting server: ", err)
	}
}
