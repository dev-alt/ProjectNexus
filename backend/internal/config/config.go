package config

import (
	"os"
	"strings"
)

type Config struct {
	Port           string
	MongoURI       string
	DatabaseName   string
	JWTSecret      string
	AllowedOrigins []string
	Environment    string
	Redis          struct {
		URL      string
		Password string
	}
}

func Load() *Config {
	config := &Config{
		Port:         getEnv("PORT", "8085"),
		MongoURI:     getEnv("MONGODB_URI", "mongodb://root:mongodbpass@localhost:27017/projectnexus?authSource=admin"),
		DatabaseName: getEnv("DATABASE_NAME", "projectnexus"),
		JWTSecret:    getEnv("JWT_SECRET", "your-jwt-secret-key"),
		Environment:  getEnv("GIN_MODE", "debug"),
	}

	// Load your configuration from environment variables or file
	config.Redis.URL = getEnv("REDIS_URL", "localhost:6479")
	config.Redis.Password = getEnv("REDIS_PASSWORD", "")

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
