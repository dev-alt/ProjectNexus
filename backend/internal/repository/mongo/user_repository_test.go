package mongo

import (
    "context"
    "testing"
    "time"
    "os"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "projectnexus/internal/models"
)

var testDB *mongo.Database
var userRepo *UserRepository

func TestMain(m *testing.M) {
    // Setup
    ctx := context.Background()
    client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://root:mongodbpass@localhost:27017"))
    if err != nil {
        panic(err)
    }

    testDB = client.Database("projectnexus_test")
    userRepo = NewUserRepository(testDB)

    // Run tests
    code := m.Run()

    // Cleanup
    if err := testDB.Drop(ctx); err != nil {
        panic(err)
    }
    if err := client.Disconnect(ctx); err != nil {
        panic(err)
    }

    os.Exit(code)
}

func TestUserRepository_Create(t *testing.T) {
    ctx := context.Background()

    // Clean up before test
    _ = testDB.Collection("users").Drop(ctx)

    user := &models.User{
        Email: "test@example.com",
        Name:  "Test User",
    }
    _ = user.SetPassword("password123")

    err := userRepo.Create(ctx, user)
    if err != nil {
        t.Errorf("Create() error = %v", err)
        return
    }

    if user.ID == "" {
        t.Error("Create() did not set user ID")
    }

    if user.CreatedAt.IsZero() {
        t.Error("Create() did not set CreatedAt")
    }

    if user.UpdatedAt.IsZero() {
        t.Error("Create() did not set UpdatedAt")
    }
}

func TestUserRepository_GetByEmail(t *testing.T) {
    ctx := context.Background()

    // Clean up before test
    _ = testDB.Collection("users").Drop(ctx)

    // Create test user
    user := &models.User{
        Email: "test@example.com",
        Name:  "Test User",
    }
    _ = user.SetPassword("password123")
    err := userRepo.Create(ctx, user)
    if err != nil {
        t.Fatal(err)
    }

    // Test getting user by email
    found, err := userRepo.GetByEmail(ctx, "test@example.com")
    if err != nil {
        t.Errorf("GetByEmail() error = %v", err)
        return
    }

    if found.Email != user.Email {
        t.Errorf("GetByEmail() got = %v, want %v", found.Email, user.Email)
    }

    // Test getting non-existent user
    _, err = userRepo.GetByEmail(ctx, "nonexistent@example.com")
    if err == nil {
        t.Error("GetByEmail() expected error for non-existent user")
    }
}

func TestUserRepository_Update(t *testing.T) {
    ctx := context.Background()

    // Clean up before test
    _ = testDB.Collection("users").Drop(ctx)

    // Create test user
    user := &models.User{
        Email: "test@example.com",
        Name:  "Test User",
    }
    _ = user.SetPassword("password123")
    err := userRepo.Create(ctx, user)
    if err != nil {
        t.Fatal(err)
    }

    // Update user
    originalUpdatedAt := user.UpdatedAt
    time.Sleep(time.Millisecond) // Ensure time difference
    
    user.Name = "Updated Name"
    err = userRepo.Update(ctx, user)
    if err != nil {
        t.Errorf("Update() error = %v", err)
        return
    }

    // Verify update
    found, err := userRepo.GetByID(ctx, user.ID)
    if err != nil {
        t.Fatal(err)
    }

    if found.Name != "Updated Name" {
        t.Errorf("Update() name not updated, got = %v, want %v", found.Name, "Updated Name")
    }

    if !found.UpdatedAt.After(originalUpdatedAt) {
        t.Error("Update() did not update UpdatedAt timestamp")
    }
}