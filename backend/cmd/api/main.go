package main

import (
	"context"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"log"
	"net/http"
	"projectnexus/internal/api/routes"
	"projectnexus/internal/config"
	"projectnexus/internal/repository"
	"projectnexus/internal/repository/mongo"
	"time"
)

func main() {
	// Load configuration
	configApp := config.Load()

	// Initialize MongoDB connection
	client, err := mongo.Initialize()
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer mongo.Close()

	// Get database instance
	db := client.Database("projectnexus")

	// Initialize Redis client with more detailed configuration
	redisClient := redis.NewClient(&redis.Options{
		Addr:        configApp.Redis.URL,
		Password:    configApp.Redis.Password,
		DB:          0,
		MaxRetries:  3,
		DialTimeout: 5 * time.Second,
	})

	// Test Redis connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}
	log.Println("Successfully connected to Redis")

	// Initialize token store
	tokenStore := repository.NewRedisTokenStore(redisClient)

	// Create gin router
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// Configure CORS
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

	// Setup routes with both DB and tokenStore
	routes.SetupRouter(r, db, tokenStore)

	// Add health check route
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
