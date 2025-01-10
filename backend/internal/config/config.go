package config

import (
    "os"
    "strings"
)

type Config struct {
    Port          string
    MongoURI      string
    DatabaseName  string
    JWTSecret     string
    AllowedOrigins []string
    Environment   string
}

func Load() *Config {
    config := &Config{
        Port:         getEnv("PORT", "8085"),
        MongoURI:     getEnv("MONGODB_URI", "mongodb://root:mongodbpass@localhost:27017/projectnexus?authSource=admin"),
        DatabaseName: getEnv("DATABASE_NAME", "projectnexus"),
        JWTSecret:    getEnv("JWT_SECRET", "your-jwt-secret-key"), // Should be properly set in production
        Environment:  getEnv("GIN_MODE", "debug"),
    }

    // Set allowed origins
    originsStr := getEnv("ALLOWED_ORIGINS", "http://localhost:3050")
    config.AllowedOrigins = strings.Split(originsStr, ",")

    return config
}

func getEnv(key, defaultValue string) string {
    value := os.Getenv(key)
    if value == "" {
        return defaultValue
    }
    return value
}