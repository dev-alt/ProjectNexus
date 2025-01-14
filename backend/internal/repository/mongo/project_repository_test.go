// internal/repository/mongo/project_repository_test.go
package mongo

import (
	"context"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"projectnexus/internal/models"
	"testing"
	"time"
)

func setupTestDB(t *testing.T) (*mongo.Database, func()) {
	ctx := context.Background()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://root:mongodbpass@localhost:27017"))
	require.NoError(t, err)

	db := client.Database("projectnexus_test")

	return db, func() {
		err := db.Drop(ctx)
		require.NoError(t, err)
		err = client.Disconnect(ctx)
		require.NoError(t, err)
	}
}

func TestProjectRepository_Create(t *testing.T) {
	db, cleanup := setupTestDB(t)
	defer cleanup()

	repo := NewProjectRepository(db)
	ctx := context.Background()

	project := &models.Project{
		Name:        "Test Project",
		Description: "Test Description",
		Status:      models.ProjectStatusPlanning,
		Progress:    0,
		Team:        []string{"user1", "user2"},
		CreatedBy:   "user1",
	}

	// Test Create
	err := repo.Create(ctx, project)
	assert.NoError(t, err)
	assert.NotEmpty(t, project.ID)
	assert.False(t, project.CreatedAt.IsZero())
	assert.False(t, project.UpdatedAt.IsZero())
}

func TestProjectRepository_GetByID(t *testing.T) {
	db, cleanup := setupTestDB(t)
	defer cleanup()

	repo := NewProjectRepository(db)
	ctx := context.Background()

	// Create test project
	project := &models.Project{
		Name:        "Test Project",
		Description: "Test Description",
		Status:      models.ProjectStatusPlanning,
		CreatedBy:   "user1",
	}
	err := repo.Create(ctx, project)
	require.NoError(t, err)

	// Test GetByID
	found, err := repo.GetByID(ctx, project.ID)
	assert.NoError(t, err)
	assert.Equal(t, project.Name, found.Name)
	assert.Equal(t, project.Description, found.Description)
	assert.Equal(t, project.Status, found.Status)
	assert.Equal(t, project.CreatedBy, found.CreatedBy)

	// Test GetByID with non-existent ID
	_, err = repo.GetByID(ctx, "nonexistentid")
	assert.Error(t, err)
}

func TestProjectRepository_GetByUser(t *testing.T) {
	db, cleanup := setupTestDB(t)
	defer cleanup()

	repo := NewProjectRepository(db)
	ctx := context.Background()

	// Create test projects
	project1 := &models.Project{
		Name:      "Project 1",
		CreatedBy: "user1",
		Team:      []string{"user1", "user2"},
	}
	project2 := &models.Project{
		Name:      "Project 2",
		CreatedBy: "user2",
		Team:      []string{"user2", "user3"},
	}

	err := repo.Create(ctx, project1)
	require.NoError(t, err)
	err = repo.Create(ctx, project2)
	require.NoError(t, err)

	// Test GetByUser
	projects, err := repo.GetByUser(ctx, "user1")
	assert.NoError(t, err)
	assert.Len(t, projects, 1)
	assert.Equal(t, project1.ID, projects[0].ID)

	projects, err = repo.GetByUser(ctx, "user2")
	assert.NoError(t, err)
	assert.Len(t, projects, 2)
}

func TestProjectRepository_Update(t *testing.T) {
	db, cleanup := setupTestDB(t)
	defer cleanup()

	repo := NewProjectRepository(db)
	ctx := context.Background()

	// Create test project
	project := &models.Project{
		Name:        "Test Project",
		Description: "Test Description",
		Status:      models.ProjectStatusPlanning,
		CreatedBy:   "user1",
	}
	err := repo.Create(ctx, project)
	require.NoError(t, err)

	// Update project
	originalUpdatedAt := project.UpdatedAt
	time.Sleep(time.Millisecond) // Ensure time difference

	project.Name = "Updated Project"
	project.Status = models.ProjectStatusInProgress
	err = repo.Update(ctx, project)
	assert.NoError(t, err)

	// Verify update
	found, err := repo.GetByID(ctx, project.ID)
	assert.NoError(t, err)
	assert.Equal(t, "Updated Project", found.Name)
	assert.Equal(t, models.ProjectStatusInProgress, found.Status)
	assert.True(t, found.UpdatedAt.After(originalUpdatedAt))
}

func TestProjectRepository_Delete(t *testing.T) {
	db, cleanup := setupTestDB(t)
	defer cleanup()

	repo := NewProjectRepository(db)
	ctx := context.Background()

	// Create test project
	project := &models.Project{
		Name:      "Test Project",
		CreatedBy: "user1",
	}
	err := repo.Create(ctx, project)
	require.NoError(t, err)

	// Delete project
	err = repo.Delete(ctx, project.ID)
	assert.NoError(t, err)

	// Verify deletion
	_, err = repo.GetByID(ctx, project.ID)
	assert.Error(t, err)
	assert.Equal(t, mongo.ErrNoDocuments, err)
}

func TestProjectRepository_List(t *testing.T) {
	db, cleanup := setupTestDB(t)
	defer cleanup()

	repo := NewProjectRepository(db)
	ctx := context.Background()

	// Create test projects
	projects := []*models.Project{
		{
			Name:      "Project 1",
			Status:    models.ProjectStatusPlanning,
			CreatedBy: "user1",
		},
		{
			Name:      "Project 2",
			Status:    models.ProjectStatusInProgress,
			CreatedBy: "user2",
		},
		{
			Name:      "Project 3",
			Status:    models.ProjectStatusInProgress,
			CreatedBy: "user1",
		},
	}

	for _, p := range projects {
		err := repo.Create(ctx, p)
		require.NoError(t, err)
	}

	// Test List with no filter
	allProjects, err := repo.List(ctx, bson.M{})
	assert.NoError(t, err)
	assert.Len(t, allProjects, 3)

	// Test List with status filter
	inProgressProjects, err := repo.List(ctx, bson.M{"status": models.ProjectStatusInProgress})
	assert.NoError(t, err)
	assert.Len(t, inProgressProjects, 2)

	// Test List with creator filter
	user1Projects, err := repo.List(ctx, bson.M{"created_by": "user1"})
	assert.NoError(t, err)
	assert.Len(t, user1Projects, 2)
}
