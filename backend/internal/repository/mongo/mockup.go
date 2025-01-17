// internal/repository/mongo/mockup.go
package mongo

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"projectnexus/internal/models"
	"projectnexus/internal/repository"
)

type mockupRepository struct {
	collection *mongo.Collection
}

func NewMockupRepository(db *mongo.Database) repository.MockupRepository {
	return &mockupRepository{
		collection: db.Collection("mockups"),
	}
}

func (r *mockupRepository) Create(ctx context.Context, mockup *models.Mockup) error {
	now := time.Now()
	mockup.CreatedAt = now
	mockup.UpdatedAt = now

	result, err := r.collection.InsertOne(ctx, mockup)
	if err != nil {
		return err
	}

	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		mockup.ID = oid.Hex()
	}

	return nil
}

func (r *mockupRepository) GetByID(ctx context.Context, id string) (*models.Mockup, error) {
	var mockup models.Mockup

	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	err = r.collection.FindOne(ctx, bson.M{"_id": oid}).Decode(&mockup)
	if err != nil {
		return nil, err
	}

	return &mockup, nil
}

func (r *mockupRepository) GetByProject(ctx context.Context, projectID string) ([]*models.Mockup, error) {
	var mockups []*models.Mockup

	cursor, err := r.collection.Find(ctx, bson.M{"project_id": projectID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &mockups); err != nil {
		return nil, err
	}

	return mockups, nil
}

func (r *mockupRepository) Update(ctx context.Context, mockup *models.Mockup) error {
	mockup.UpdatedAt = time.Now()

	oid, err := primitive.ObjectIDFromHex(mockup.ID)
	if err != nil {
		return err
	}

	_, err = r.collection.ReplaceOne(
		ctx,
		bson.M{"_id": oid},
		mockup,
	)
	return err
}

func (r *mockupRepository) Delete(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": oid})
	return err
}

func (r *mockupRepository) List(ctx context.Context) ([]*models.Mockup, error) {
	var mockups []*models.Mockup

	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &mockups); err != nil {
		return nil, err
	}

	return mockups, nil
}
