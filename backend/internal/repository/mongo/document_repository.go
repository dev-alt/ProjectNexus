// Package mongo internal/repository/mongo/document_repository.go
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
	errs "projectnexus/internal/errors"
	"projectnexus/internal/models"
	"time"
)

type DocumentRepository struct {
	documents *mongo.Collection
	versions  *mongo.Collection
}

func NewDocumentRepository(db *mongo.Database) *DocumentRepository {
	repo := &DocumentRepository{
		documents: db.Collection("documents"),
		versions:  db.Collection("document_versions"),
	}

	// Ensure indexes are created
	if err := repo.ensureIndexes(context.Background()); err != nil {
		log.Printf("Warning: Failed to create indexes: %v", err)
	}

	return repo
}

func (r *DocumentRepository) ensureIndexes(ctx context.Context) error {
	// Create indexes for the documents collection
	_, err := r.documents.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "project_id", Value: 1},
				{Key: "title", Value: 1},
			},
		},
		{
			Keys: bson.D{{Key: "created_at", Value: 1}},
		},
	})
	if err != nil {
		return fmt.Errorf("failed to create document indexes: %w", err)
	}

	// Create indexes for the versions collection
	_, err = r.versions.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "document_id", Value: 1},
				{Key: "version", Value: -1},
			},
		},
	})
	if err != nil {
		return fmt.Errorf("failed to create version indexes: %w", err)
	}

	return nil
}

func (r *DocumentRepository) GetByID(ctx context.Context, id string) (*models.Document, error) {
	// Add logging
	log.Printf("Getting document from repository - ID: %s", id)

	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("Invalid document ID format: %v", err)
		return nil, fmt.Errorf("invalid document ID: %w", err)
	}

	var doc models.Document
	err = r.documents.FindOne(ctx, bson.M{"_id": oid}).Decode(&doc)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			log.Printf("Document not found: %s", id)
			return nil, errs.ErrDocumentNotFound
		}
		log.Printf("Error fetching document: %v", err)
		return nil, err
	}

	return &doc, nil
}

func (r *DocumentRepository) GetByProject(ctx context.Context, projectID string) ([]*models.Document, error) {
	log.Printf("Getting documents for project: %s", projectID)

	cursor, err := r.documents.Find(ctx, bson.M{"project_id": projectID})
	if err != nil {
		log.Printf("Error querying documents: %v", err)
		return nil, err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			log.Printf("Error closing cursor: %v", err)
		}
	}(cursor, ctx)

	var docs []*models.Document
	if err = cursor.All(ctx, &docs); err != nil {
		log.Printf("Error decoding documents: %v", err)
		return nil, err
	}

	if docs == nil {
		docs = make([]*models.Document, 0) // Return empty slice instead of nil
	}

	log.Printf("Found %d documents for project %s", len(docs), projectID)
	return docs, nil
}

func (r *DocumentRepository) Update(ctx context.Context, doc *models.Document) error {
	// Add debug logging
	log.Printf("Updating document in repository: %+v", doc)

	oid, err := primitive.ObjectIDFromHex(doc.ID)
	if err != nil {
		log.Printf("Invalid document ID format: %v", err)
		return fmt.Errorf("invalid document ID: %w", err)
	}

	doc.UpdatedAt = time.Now()
	doc.Version++

	// Create update document with only fields that should be updated
	updateDoc := bson.M{
		"$set": bson.M{
			"title":      doc.Title,
			"type":       doc.Type,
			"content":    doc.Content,
			"version":    doc.Version,
			"status":     doc.Status,
			"updated_at": doc.UpdatedAt,
		},
	}

	result, err := r.documents.UpdateOne(
		ctx,
		bson.M{"_id": oid},
		updateDoc,
	)
	if err != nil {
		log.Printf("Failed to update document: %v", err)
		return err
	}

	if result.MatchedCount == 0 {
		log.Printf("No document found with ID: %s", doc.ID)
		return errs.ErrDocumentNotFound
	}

	// Create new version
	version := &models.DocumentVersion{
		DocumentID: doc.ID,
		Version:    doc.Version,
		Content:    doc.Content,
		CreatedBy:  doc.CreatedBy,
		CreatedAt:  doc.UpdatedAt,
	}

	if err := r.CreateVersion(ctx, version); err != nil {
		log.Printf("Failed to create document version: %v", err)
		// Consider rolling back the document update
		return fmt.Errorf("failed to create version: %w", err)
	}

	return nil
}

func (r *DocumentRepository) Delete(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	// Delete document
	_, err = r.documents.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return err
	}

	// Delete all versions
	_, err = r.versions.DeleteMany(ctx, bson.M{"document_id": id})
	return err
}

func (r *DocumentRepository) Create(ctx context.Context, doc *models.Document) error {
	// Add logging
	log.Printf("Creating document: %+v", doc)

	doc.CreatedAt = time.Now()
	doc.UpdatedAt = time.Now()
	doc.Version = 1

	if doc.Status == "" {
		doc.Status = models.DocumentStatusDraft
	}

	result, err := r.documents.InsertOne(ctx, doc)
	if err != nil {
		log.Printf("Error inserting document: %v", err)
		return err
	}

	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		doc.ID = oid.Hex()
	} else {
		log.Printf("Warning: InsertedID is not an ObjectID: %v", result.InsertedID)
	}

	// Create initial version
	version := &models.DocumentVersion{
		DocumentID: doc.ID,
		Version:    1,
		Content:    doc.Content,
		CreatedBy:  doc.CreatedBy,
		CreatedAt:  doc.CreatedAt,
	}

	if err := r.CreateVersion(ctx, version); err != nil {
		log.Printf("Error creating document version: %v", err)
		// Consider rolling back the document creation
		return err
	}

	return nil
}

func (r *DocumentRepository) CreateVersion(ctx context.Context, version *models.DocumentVersion) error {
	// Add logging
	log.Printf("Creating document version: %+v", version)

	result, err := r.versions.InsertOne(ctx, version)
	if err != nil {
		log.Printf("Error inserting document version: %v", err)
		return err
	}

	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		version.ID = oid.Hex()
	} else {
		log.Printf("Warning: Version InsertedID is not an ObjectID: %v", result.InsertedID)
	}

	return nil
}

func (r *DocumentRepository) GetVersions(ctx context.Context, documentID string) ([]*models.DocumentVersion, error) {
	cursor, err := r.versions.Find(ctx,
		bson.M{"document_id": documentID},
		options.Find().SetSort(bson.M{"version": -1}),
	)
	if err != nil {
		return nil, err
	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			log.Printf("Error closing cursor: %v", err)
		}
	}(cursor, ctx)

	var versions []*models.DocumentVersion
	if err = cursor.All(ctx, &versions); err != nil {
		return nil, err
	}

	return versions, nil
}
