// cmd/test/main.go
package main

import (
    "context"
    "fmt"
    "log"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    // We're using "mongodb" as the hostname since we're running in Docker
uri := "mongodb://root:mongodbpass@localhost:27017/projectnexus?authSource=admin"
    
    log.Printf("Connecting to MongoDB: %s\n", uri)
    
    clientOptions := options.Client().
        ApplyURI(uri).
        SetServerSelectionTimeout(5 * time.Second)

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    client, err := mongo.Connect(ctx, clientOptions)
    if err != nil {
        log.Fatalf("Failed to create client: %v", err)
    }
    defer client.Disconnect(ctx)

    // Ping MongoDB
    if err = client.Ping(ctx, nil); err != nil {
        log.Fatalf("Failed to ping MongoDB: %v", err)
    }

    fmt.Println("Successfully connected to MongoDB!")

    // Try to write to the database
    collection := client.Database("projectnexus").Collection("test")
    
    doc := bson.D{{"test", "Hello, MongoDB!"}}
    result, err := collection.InsertOne(ctx, doc)
    if err != nil {
        log.Fatalf("Failed to insert document: %v", err)
    }

    fmt.Printf("Inserted document with ID: %v\n", result.InsertedID)
}