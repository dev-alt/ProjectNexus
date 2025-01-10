package main

import (
    "log"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "net/http"
)

func main() {
    r := gin.Default()

    // Configure CORS
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3050"}
    config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
    
    r.Use(cors.New(config))
    
    // Health check endpoint
    r.GET("/api/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status": "healthy",
            "message": "API is running on port 8085",
        })
    })

    // Test endpoint with some data
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