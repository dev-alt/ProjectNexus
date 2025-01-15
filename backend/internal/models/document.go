// Package models internal/models/document.go
package models

import (
	"fmt"
	"strings"
	"time"
)

type DocumentType string

const (
	DocumentTypeHLD   DocumentType = "High-Level Design"
	DocumentTypeLLD   DocumentType = "Low-Level Design"
	DocumentTypeSpec  DocumentType = "Technical Spec"
	DocumentTypeOther DocumentType = "Other"
)

type DocumentStatus string

const (
	DocumentStatusDraft    DocumentStatus = "Draft"
	DocumentStatusInReview DocumentStatus = "In Review"
	DocumentStatusApproved DocumentStatus = "Approved"
	DocumentStatusRejected DocumentStatus = "Rejected"
)

type Document struct {
	ID        string         `bson:"_id,omitempty" json:"id"`
	ProjectID string         `bson:"project_id" json:"projectId"`
	Title     string         `bson:"title" json:"title"`
	Type      DocumentType   `bson:"type" json:"type"`
	Content   string         `bson:"content" json:"content"`
	Version   int            `bson:"version" json:"version"`
	Status    DocumentStatus `bson:"status" json:"status"` // Add status field
	CreatedBy string         `bson:"created_by" json:"createdBy"`
	CreatedAt time.Time      `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time      `bson:"updated_at" json:"updatedAt"`
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
	ProjectID string         `json:"projectId" binding:"required"`
	Title     string         `json:"title" binding:"required"`
	Type      DocumentType   `json:"type" binding:"required"`
	Content   string         `json:"content" binding:"required"`
	Status    DocumentStatus `json:"status" binding:"required"`
}

type UpdateDocumentInput struct {
	Title   *string         `json:"title,omitempty"`
	Type    *DocumentType   `json:"type,omitempty"`
	Content *string         `json:"content,omitempty"`
	Status  *DocumentStatus `json:"status,omitempty"`
}

func (i *UpdateDocumentInput) Validate() error {
	if i.Title != nil && strings.TrimSpace(*i.Title) == "" {
		return fmt.Errorf("title cannot be empty")
	}
	if i.Type != nil && !i.Type.IsValid() {
		return fmt.Errorf("invalid document type: %s", *i.Type)
	}
	if i.Content != nil && strings.TrimSpace(*i.Content) == "" {
		return fmt.Errorf("content cannot be empty")
	}
	return nil
}

func (t DocumentType) IsValid() bool {
	switch t {
	case DocumentTypeHLD,
		DocumentTypeLLD,
		DocumentTypeSpec,
		DocumentTypeOther:
		return true
	default:
		return false
	}
}

func (d *Document) Validate() error {
	if d.ProjectID == "" {
		return fmt.Errorf("project ID is required")
	}
	if d.Title == "" {
		return fmt.Errorf("title is required")
	}
	if !d.Type.IsValid() {
		return fmt.Errorf("invalid document type: %s", d.Type)
	}
	if d.Version < 0 {
		return fmt.Errorf("version cannot be negative")
	}
	if d.Status == "" {
		return fmt.Errorf("status is required")
	}
	return nil
}

func (i *CreateDocumentInput) Validate() error {
	if i.ProjectID == "" {
		return fmt.Errorf("project ID is required")
	}
	if i.Title == "" {
		return fmt.Errorf("title is required")
	}
	if !i.Type.IsValid() {
		return fmt.Errorf("invalid document type: %s", i.Type)
	}
	if i.Content == "" {
		return fmt.Errorf("content is required")
	}
	return nil
}
