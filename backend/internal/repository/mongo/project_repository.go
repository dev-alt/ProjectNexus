// Package mongo internal/repository/mongo/project_repository.go
package mongo

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"time"
)

type ProjectRepository struct {
	collection *mongo.Collection
}

func NewProjectRepository(db *mongo.Database) *ProjectRepository {
	return &ProjectRepository{
		collection: db.Collection("projects"),
	}
}

func (r *ProjectRepository) Create(ctx context.Context, project *models.Project) error {
	project.CreatedAt = time.Now()
	project.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(ctx, project)
	if err != nil {
		log.Printf("MongoDB error creating project: %v", err)
		return fmt.Errorf("failed to create project in database: %w", err)
	}

	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		project.ID = oid.Hex()
	}

	return nil
}

func (r *ProjectRepository) GetByID(ctx context.Context, id string) (*models.Project, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var project models.Project
	err = r.collection.FindOne(ctx, bson.M{"_id": oid}).Decode(&project)
	if err != nil {
		return nil, err
	}

	return &project, nil
}

func (r *ProjectRepository) GetByUser(ctx context.Context, userID string) ([]*models.Project, error) {
	cursor, err := r.collection.Find(ctx, bson.M{
		"$or": []bson.M{
			{"created_by": userID},
			{"team": userID},
		},
	})
	if err != nil {
		return nil, err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			log.Printf("Error closing cursor: %v", err)
		}
	}(cursor, ctx)

	var projects []*models.Project
	if err = cursor.All(ctx, &projects); err != nil {
		return nil, err
	}

	return projects, nil
}

func (r *ProjectRepository) Update(ctx context.Context, project *models.Project) error {
	log.Printf("Updating project in repository: %+v", project)

	oid, err := primitive.ObjectIDFromHex(project.ID)
	if err != nil {
		return fmt.Errorf("invalid project ID: %w", err)
	}

	project.UpdatedAt = time.Now()

	updateDoc := bson.M{
		"$set": bson.M{
			"name":        project.Name,
			"description": project.Description,
			"status":      project.Status,
			"progress":    project.Progress,
			"team":        project.Team,
			"updated_at":  project.UpdatedAt,
		},
	}

	result, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": oid},
		updateDoc,
	)
	if err != nil {
		log.Printf("Failed to update project: %v", err)
		return err
	}

	if result.MatchedCount == 0 {
		return repository.ErrProjectNotFound
	}

	return nil
}

func (r *ProjectRepository) Delete(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": oid})
	return err
}

func (r *ProjectRepository) List(ctx context.Context, filter interface{}) ([]*models.Project, error) {
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			log.Printf("Error closing cursor: %v", err)
		}
	}(cursor, ctx)

	var projects []*models.Project
	if err = cursor.All(ctx, &projects); err != nil {
		return nil, err
	}

	return projects, nil
}

func (r *ProjectRepository) CheckUserAccess(ctx context.Context, projectID string, userID string) (bool, error) {
	// Add logging
	log.Printf("Checking user access - ProjectID: %s, UserID: %s", projectID, userID)

	oid, err := primitive.ObjectIDFromHex(projectID)
	if err != nil {
		log.Printf("Invalid project ID format: %v", err)
		return false, repository.ErrProjectNotFound
	}

	var project models.Project
	err = r.collection.FindOne(ctx, bson.M{"_id": oid}).Decode(&project)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			log.Printf("Project not found: %s", projectID)
			return false, repository.ErrProjectNotFound
		}
		log.Printf("Error fetching project: %v", err)
		return false, err
	}

	// Check if user is project creator or team member
	if project.CreatedBy == userID {
		return true, nil
	}

	for _, memberID := range project.Team {
		if memberID == userID {
			return true, nil
		}
	}

	return false, nil
}
