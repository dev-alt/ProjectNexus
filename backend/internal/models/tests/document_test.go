// internal/models/document_test.go
package tests

import (
	"github.com/stretchr/testify/assert"
	"projectnexus/internal/models"
	"testing"
)

func TestDocumentType_IsValid(t *testing.T) {
	tests := []struct {
		name    string
		docType models.DocumentType
		want    bool
	}{
		{
			name:    "valid HLD",
			docType: models.DocumentTypeHLD,
			want:    true,
		},
		{
			name:    "valid LLD",
			docType: models.DocumentTypeLLD,
			want:    true,
		},
		{
			name:    "valid spec",
			docType: models.DocumentTypeSpec,
			want:    true,
		},
		{
			name:    "valid other",
			docType: models.DocumentTypeOther,
			want:    true,
		},
		{
			name:    "invalid type",
			docType: models.DocumentType("Invalid"),
			want:    false,
		},
		{
			name:    "empty type",
			docType: models.DocumentType(""),
			want:    false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, tt.docType.IsValid())
		})
	}
}

func TestCreateDocumentInput_Validate(t *testing.T) {
	tests := []struct {
		name    string
		input   models.CreateDocumentInput
		wantErr bool
	}{
		{
			name: "valid input",
			input: models.CreateDocumentInput{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      models.DocumentTypeHLD,
				Content:   "Test content",
			},
			wantErr: false,
		},
		{
			name: "empty project ID",
			input: models.CreateDocumentInput{
				Title:   "Test Document",
				Type:    models.DocumentTypeHLD,
				Content: "Test content",
			},
			wantErr: true,
		},
		{
			name: "empty title",
			input: models.CreateDocumentInput{
				ProjectID: "proj1",
				Type:      models.DocumentTypeHLD,
				Content:   "Test content",
			},
			wantErr: true,
		},
		{
			name: "invalid type",
			input: models.CreateDocumentInput{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      models.DocumentType("Invalid"),
				Content:   "Test content",
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.input.Validate()
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestUpdateDocumentInput_Validate(t *testing.T) {
	tests := []struct {
		name    string
		input   models.UpdateDocumentInput
		wantErr bool
	}{
		{
			name: "valid input - all fields",
			input: models.UpdateDocumentInput{
				Title:   stringPtr("Updated Title"),
				Type:    docTypePtr(models.DocumentTypeHLD),
				Content: stringPtr("Updated content"),
			},
			wantErr: false,
		},
		{
			name: "valid input - partial update",
			input: models.UpdateDocumentInput{
				Title: stringPtr("Updated Title"),
			},
			wantErr: false,
		},
		{
			name: "invalid type",
			input: models.UpdateDocumentInput{
				Type: docTypePtr("Invalid"),
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.input.Validate()
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestDocument_Validate(t *testing.T) {
	tests := []struct {
		name    string
		doc     models.Document
		wantErr bool
	}{
		{
			name: "valid document",
			doc: models.Document{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      models.DocumentTypeHLD,
				Content:   "Test content",
				Version:   1,
				CreatedBy: "user1",
			},
			wantErr: false,
		},
		{
			name: "missing project ID",
			doc: models.Document{
				Title:     "Test Document",
				Type:      models.DocumentTypeHLD,
				Content:   "Test content",
				Version:   1,
				CreatedBy: "user1",
			},
			wantErr: true,
		},
		{
			name: "invalid type",
			doc: models.Document{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      models.DocumentType("Invalid"),
				Content:   "Test content",
				Version:   1,
				CreatedBy: "user1",
			},
			wantErr: true,
		},
		{
			name: "negative version",
			doc: models.Document{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      models.DocumentTypeHLD,
				Content:   "Test content",
				Version:   -1,
				CreatedBy: "user1",
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.doc.Validate()
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

// Helper functions for creating pointers
func stringPtr(s string) *string {
	return &s
}

func docTypePtr(t models.DocumentType) *models.DocumentType {
	return &t
}
