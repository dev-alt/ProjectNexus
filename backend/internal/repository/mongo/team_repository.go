// Package mongo internal/repository/mongo/team_repository.go
package mongo

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"time"
)

type TeamRepository struct {
	collection *mongo.Collection
}

func NewTeamRepository(db *mongo.Database) repository.TeamRepository {
	repo := &TeamRepository{
		collection: db.Collection("team_members"),
	}

	// Ensure indexes
	if err := repo.ensureIndexes(context.Background()); err != nil {
		log.Printf("Warning: Failed to create team member indexes: %v", err)
	}

	return repo
}

func (r *TeamRepository) ensureIndexes(ctx context.Context) error {
	_, err := r.collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "project_id", Value: 1},
				{Key: "user_id", Value: 1},
			},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: bson.D{{Key: "status", Value: 1}},
		},
	})
	return err
}

func (r *TeamRepository) Create(ctx context.Context, member *models.TeamMember) error {
	member.CreatedAt = time.Now()
	member.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(ctx, member)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return repository.ErrAlreadyInTeam
		}
		return fmt.Errorf("failed to create team member: %w", err)
	}

	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		member.ID = oid.Hex()
	}

	return nil
}

func (r *TeamRepository) GetByID(ctx context.Context, id string) (*models.TeamMember, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, repository.ErrNotFound
	}

	var member models.TeamMember
	err = r.collection.FindOne(ctx, bson.M{"_id": oid}).Decode(&member)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, repository.ErrNotFound
		}
		return nil, err
	}

	return &member, nil
}

func (r *TeamRepository) GetByProjectAndUser(ctx context.Context, projectID, userID string) (*models.TeamMember, error) {
	var member models.TeamMember
	err := r.collection.FindOne(ctx, bson.M{
		"project_id": projectID,
		"user_id":    userID,
	}).Decode(&member)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, repository.ErrNotFound
		}
		return nil, err
	}

	return &member, nil
}

func (r *TeamRepository) GetProjectMembers(ctx context.Context, projectID string) ([]*models.TeamMember, error) {
	cursor, err := r.collection.Find(ctx, bson.M{
		"project_id": projectID,
		"status":     models.TeamMemberStatusActive,
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

	var members []*models.TeamMember
	if err = cursor.All(ctx, &members); err != nil {
		return nil, err
	}

	return members, nil
}

func (r *TeamRepository) Update(ctx context.Context, member *models.TeamMember) error {
	member.UpdatedAt = time.Now()

	oid, err := primitive.ObjectIDFromHex(member.ID)
	if err != nil {
		return repository.ErrNotFound
	}

	result, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": oid},
		bson.M{
			"$set": bson.M{
				"role":       member.Role,
				"status":     member.Status,
				"updated_at": member.UpdatedAt,
			},
		},
	)

	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return repository.ErrNotFound
	}

	return nil
}

func (r *TeamRepository) Delete(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return repository.ErrNotFound
	}

	result, err := r.collection.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return repository.ErrNotFound
	}

	return nil
}
