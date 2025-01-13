// internal/repository/mongo/document_repository.go
package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"projectnexus/internal/models"
	"time"
)

type DocumentRepository struct {
	documents *mongo.Collection
	versions  *mongo.Collection
}

func NewDocumentRepository(db *mongo.Database) *DocumentRepository {
	return &DocumentRepository{
		documents: db.Collection("documents"),
		versions:  db.Collection("document_versions"),
	}
}

func (r *DocumentRepository) Create(ctx context.Context, doc *models.Document) error {
	doc.CreatedAt = time.Now()
	doc.UpdatedAt = time.Now()
	doc.Version = 1

	result, err := r.documents.InsertOne(ctx, doc)
	if err != nil {
		return err
	}

	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		doc.ID = oid.Hex()
	}

	// Create initial version
	version := &models.DocumentVersion{
		DocumentID: doc.ID,
		Version:    1,
		Content:    doc.Content,
		CreatedBy:  doc.CreatedBy,
		CreatedAt:  doc.CreatedAt,
	}

	return r.CreateVersion(ctx, version)
}

func (r *DocumentRepository) GetByID(ctx context.Context, id string) (*models.Document, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var doc models.Document
	err = r.documents.FindOne(ctx, bson.M{"_id": oid}).Decode(&doc)
	if err != nil {
		return nil, err
	}

	return &doc, nil
}

func (r *DocumentRepository) GetByProject(ctx context.Context, projectID string) ([]*models.Document, error) {
	cursor, err := r.documents.Find(ctx, bson.M{"project_id": projectID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var docs []*models.Document
	if err = cursor.All(ctx, &docs); err != nil {
		return nil, err
	}

	return docs, nil
}

func (r *DocumentRepository) Update(ctx context.Context, doc *models.Document) error {
	oid, err := primitive.ObjectIDFromHex(doc.ID)
	if err != nil {
		return err
	}

	doc.UpdatedAt = time.Now()
	doc.Version++

	_, err = r.documents.UpdateOne(
		ctx,
		bson.M{"_id": oid},
		bson.M{"$set": doc},
	)
	if err != nil {
		return err
	}

	// Create new version
	version := &models.DocumentVersion{
		DocumentID: doc.ID,
		Version:    doc.Version,
		Content:    doc.Content,
		CreatedBy:  doc.CreatedBy,
		CreatedAt:  doc.UpdatedAt,
	}

	return r.CreateVersion(ctx, version)
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

func (r *DocumentRepository) CreateVersion(ctx context.Context, version *models.DocumentVersion) error {
	result, err := r.versions.InsertOne(ctx, version)
	if err != nil {
		return err
	}

	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		version.ID = oid.Hex()
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
	defer cursor.Close(ctx)

	var versions []*models.DocumentVersion
	if err = cursor.All(ctx, &versions); err != nil {
		return nil, err
	}

	return versions, nil
}
