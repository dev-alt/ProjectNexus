package mongo

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

// Initialize establishes a connection to the MongoDB database
func Initialize() (*mongo.Client, error) {
	if client != nil {
		return client, nil
	}

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		uri = "mongodb://root:mongodbpass@localhost:27017/projectnexus?authSource=admin"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	newClient, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}

	// Ping the database
	err = newClient.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}

	client = newClient
	log.Println("Connected to MongoDB!")
	return client, nil
}

// GetClient returns the MongoDB client instance
func GetClient() *mongo.Client {
	return client
}

// GetDatabase returns a specific database
func GetDatabase(name string) *mongo.Database {
	if client == nil {
		var err error
		client, err = Initialize()
		if err != nil {
			log.Fatal(err)
		}
	}
	return client.Database(name)
}

// Close closes the MongoDB connection
func Close() {
	if client != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		
		if err := client.Disconnect(ctx); err != nil {
			log.Printf("Error closing MongoDB connection: %v", err)
		}
		client = nil
		log.Println("Closed MongoDB connection")
	}
}