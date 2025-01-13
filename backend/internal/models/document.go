// internal/models/document.go
package models

import "time"

type DocumentType string

const (
	DocumentTypeHLD   DocumentType = "High-Level Design"
	DocumentTypeLLD   DocumentType = "Low-Level Design"
	DocumentTypeSpec  DocumentType = "Technical Spec"
	DocumentTypeOther DocumentType = "Other"
)

type Document struct {
	ID        string       `bson:"_id,omitempty" json:"id"`
	ProjectID string       `bson:"project_id" json:"projectId"`
	Title     string       `bson:"title" json:"title"`
	Type      DocumentType `bson:"type" json:"type"`
	Content   string       `bson:"content" json:"content"`
	Version   int          `bson:"version" json:"version"`
	CreatedBy string       `bson:"created_by" json:"createdBy"`
	CreatedAt time.Time    `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time    `bson:"updated_at" json:"updatedAt"`
}

type DocumentVersion struct {
	ID         string    `bson:"_id,omitempty" json:"id"`
	DocumentID string    `bson:"document_id" json:"documentId"`
	Version    int       `bson:"version" json:"version"`
	Content    string    `bson:"content" json:"content"`
	CreatedBy  string    `bson:"created_by" json:"createdBy"`
	CreatedAt  time.Time `bson:"created_at" json:"createdAt"`
}

type CreateDocumentInput struct {
	ProjectID string       `json:"projectId" binding:"required"`
	Title     string       `json:"title" binding:"required"`
	Type      DocumentType `json:"type" binding:"required"`
	Content   string       `json:"content" binding:"required"`
}

type UpdateDocumentInput struct {
	Title   *string       `json:"title,omitempty"`
	Type    *DocumentType `json:"type,omitempty"`
	Content *string       `json:"content,omitempty"`
}
