package mongo_test

import (
	"context"
	"log"
	"os"
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestMongoConnection(t *testing.T) {
	// MongoDB connection URI from environment variable
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		uri = "mongodb://root:mongodbpass@localhost:27017/projectnexus?authSource=admin"
	}

	// Create a context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		t.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := client.Disconnect(ctx); err != nil {
			log.Printf("Failed to disconnect from MongoDB: %v", err)
		}
	}()

	// Ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		t.Fatalf("Failed to ping MongoDB: %v", err)
	}

	// Get the 'projectnexus' database
	db := client.Database("projectnexus")

	// Try to create a test collection
	collection := db.Collection("test_connection")

	// Insert a test document
	testDoc := bson.D{{"test_field", "test_value"}, {"timestamp", time.Now()}}
	_, err = collection.InsertOne(ctx, testDoc)
	if err != nil {
		t.Fatalf("Failed to insert test document: %v", err)
	}

	// Try to read the document back
	var result bson.M
	err = collection.FindOne(ctx, bson.D{{"test_field", "test_value"}}).Decode(&result)
	if err != nil {
		t.Fatalf("Failed to read test document: %v", err)
	}

	// Clean up - delete the test document
	_, err = collection.DeleteOne(ctx, bson.D{{"test_field", "test_value"}})
	if err != nil {
		t.Fatalf("Failed to delete test document: %v", err)
	}

	t.Log("MongoDB connection test successful!")
}