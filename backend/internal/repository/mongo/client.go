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
        uri = "mongodb://root:mongodbpass@localhost:27017/?authSource=admin"
    }

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    clientOptions := options.Client().ApplyURI(uri).SetDirect(true)
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

    // Create the database and collections if they don't exist
    db := client.Database("projectnexus")
    
    // Ensure indexes
    err = ensureIndexes(ctx, db)
    if err != nil {
        log.Printf("Warning: Failed to create indexes: %v", err)
    }

    return client, nil
}

func ensureIndexes(ctx context.Context, db *mongo.Database) error {
    // Create unique index on email field for users collection
    usersCollection := db.Collection("users")
    _, err := usersCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
        Keys: map[string]interface{}{
            "email": 1,
        },
        Options: options.Index().SetUnique(true),
    })
    return err
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