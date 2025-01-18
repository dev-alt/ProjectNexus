package mongo

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	errs "projectnexus/internal/errors"
	"projectnexus/internal/models"
	"time"
)

type TeamMemberRepository struct {
	collection *mongo.Collection
}

func (r *TeamMemberRepository) GetByTeamID(ctx context.Context, teamID string) ([]*models.TeamMember, error) {
	// Define the filter for finding team members by their team ID
	filter := bson.M{"team_id": teamID}

	// Perform the database query to find matching documents
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch team members: %w", err)
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			fmt.Printf("failed to close cursor: %v", err)
		}
	}(cursor, ctx)

	// Prepare a slice to store the results
	var teamMembers []*models.TeamMember
	if err := cursor.All(ctx, &teamMembers); err != nil {
		return nil, fmt.Errorf("failed to decode team members: %w", err)
	}

	return teamMembers, nil
}

func (r *TeamMemberRepository) GetTeamMember(ctx context.Context, id string) (*models.TeamMember, error) {
	// Convert the ID from string to ObjectID for MongoDB query
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid team member ID: %w", err)
	}

	// Initialize a variable to store the result
	var teamMember models.TeamMember

	// Query the collection by ID
	err = r.collection.FindOne(ctx, bson.M{"_id": oid}).Decode(&teamMember)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("team member not found: %w", err)
		}
		return nil, fmt.Errorf("failed to fetch team member: %w", err)
	}

	// Return the result
	return &teamMember, nil
}

func NewTeamMemberRepository(db *mongo.Database) *TeamMemberRepository {
	return &TeamMemberRepository{
		collection: db.Collection("team_members"),
	}
}

func (r *TeamMemberRepository) Create(ctx context.Context, member *models.TeamMember) error {
	_, err := r.collection.InsertOne(ctx, member)
	if err != nil {
		return fmt.Errorf("failed to create team member: %w", err)
	}
	return nil
}

func (r *TeamMemberRepository) GetByID(ctx context.Context, id string) (*models.TeamMember, error) {
	var member models.TeamMember
	if err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&member); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("team member not found: %w", err)
		}
		return nil, fmt.Errorf("failed to get team member: %w", err)
	}
	return &member, nil
}

func (r *TeamMemberRepository) GetByProjectAndUser(ctx context.Context, projectID, userID string) (*models.TeamMember, error) {
	var member models.TeamMember
	filter := bson.M{"project_id": projectID, "user_id": userID}
	if err := r.collection.FindOne(ctx, filter).Decode(&member); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("team member not found: %w", err)
		}
		return nil, fmt.Errorf("failed to get team member: %w", err)
	}
	return &member, nil
}

func (r *TeamMemberRepository) GetProjectMembers(ctx context.Context, projectID string) ([]*models.TeamMember, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"project_id": projectID})
	if err != nil {
		return nil, fmt.Errorf("failed to get project members: %w", err)
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			fmt.Printf("failed to close cursor: %v", err)
		}
	}(cursor, ctx)

	var members []*models.TeamMember
	if err := cursor.All(ctx, &members); err != nil {
		return nil, fmt.Errorf("failed to decode project members: %w", err)
	}
	return members, nil
}

func (r *TeamMemberRepository) Update(ctx context.Context, member *models.TeamMember) error {
	filter := bson.M{"_id": member.ID}
	update := bson.M{
		"$set": bson.M{
			"role":   member.Role,
			"status": member.Status,
		},
	}
	_, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update team member: %w", err)
	}
	return nil
}

func (r *TeamMemberRepository) Delete(ctx context.Context, id string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("failed to delete team member: %w", err)
	}
	return nil
}

func (r *TeamMemberRepository) CreateTeamMember(ctx context.Context, member *models.TeamMember) error {
	member.CreatedAt = time.Now()
	member.UpdatedAt = time.Now()

	_, err := r.collection.InsertOne(ctx, member)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return errs.ErrAlreadyInTeam
		}
		return fmt.Errorf("failed to create team member: %w", err)
	}

	return nil
}
