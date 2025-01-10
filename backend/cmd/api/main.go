package main

import (
    "log"
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "projectnexus/internal/api/routes"
    "projectnexus/internal/repository/mongo"
)

func main() {
    // Initialize MongoDB connection
    client, err := mongo.Initialize()
    if err != nil {
        log.Fatal("Failed to connect to MongoDB:", err)
    }
    defer mongo.Close()

    // Get database instance
    db := client.Database("projectnexus")

    // Setup the main API router with routes
    r := routes.SetupRouter(db)

    // Configure CORS
    corsConfig := cors.DefaultConfig()
    corsConfig.AllowOrigins = []string{"http://localhost:3050"}
    corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
    corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
    
    r.Use(cors.New(corsConfig))
    
    // Add non-API routes to the main router
    r.GET("/api/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status": "healthy",
            "message": "API is running on port 8085",
        })
    })

    r.GET("/api/test", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "data": []map[string]interface{}{
                {
                    "id": 1,
                    "name": "Test Project",
                    "status": "active",
                },
                {
                    "id": 2,
                    "name": "Another Project",
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