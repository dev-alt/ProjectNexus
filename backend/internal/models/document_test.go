// internal/models/document_test.go
package models

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestDocumentType_IsValid(t *testing.T) {
	tests := []struct {
		name    string
		docType DocumentType
		want    bool
	}{
		{
			name:    "valid HLD",
			docType: DocumentTypeHLD,
			want:    true,
		},
		{
			name:    "valid LLD",
			docType: DocumentTypeLLD,
			want:    true,
		},
		{
			name:    "valid spec",
			docType: DocumentTypeSpec,
			want:    true,
		},
		{
			name:    "valid other",
			docType: DocumentTypeOther,
			want:    true,
		},
		{
			name:    "invalid type",
			docType: DocumentType("Invalid"),
			want:    false,
		},
		{
			name:    "empty type",
			docType: DocumentType(""),
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
		input   CreateDocumentInput
		wantErr bool
	}{
		{
			name: "valid input",
			input: CreateDocumentInput{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      DocumentTypeHLD,
				Content:   "Test content",
			},
			wantErr: false,
		},
		{
			name: "empty project ID",
			input: CreateDocumentInput{
				Title:   "Test Document",
				Type:    DocumentTypeHLD,
				Content: "Test content",
			},
			wantErr: true,
		},
		{
			name: "empty title",
			input: CreateDocumentInput{
				ProjectID: "proj1",
				Type:      DocumentTypeHLD,
				Content:   "Test content",
			},
			wantErr: true,
		},
		{
			name: "invalid type",
			input: CreateDocumentInput{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      DocumentType("Invalid"),
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
		input   UpdateDocumentInput
		wantErr bool
	}{
		{
			name: "valid input - all fields",
			input: UpdateDocumentInput{
				Title:   stringPtr("Updated Title"),
				Type:    docTypePtr(DocumentTypeHLD),
				Content: stringPtr("Updated content"),
			},
			wantErr: false,
		},
		{
			name: "valid input - partial update",
			input: UpdateDocumentInput{
				Title: stringPtr("Updated Title"),
			},
			wantErr: false,
		},
		{
			name: "invalid type",
			input: UpdateDocumentInput{
				Type: docTypePtr(DocumentType("Invalid")),
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
		doc     Document
		wantErr bool
	}{
		{
			name: "valid document",
			doc: Document{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      DocumentTypeHLD,
				Content:   "Test content",
				Version:   1,
				CreatedBy: "user1",
			},
			wantErr: false,
		},
		{
			name: "missing project ID",
			doc: Document{
				Title:     "Test Document",
				Type:      DocumentTypeHLD,
				Content:   "Test content",
				Version:   1,
				CreatedBy: "user1",
			},
			wantErr: true,
		},
		{
			name: "invalid type",
			doc: Document{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      DocumentType("Invalid"),
				Content:   "Test content",
				Version:   1,
				CreatedBy: "user1",
			},
			wantErr: true,
		},
		{
			name: "negative version",
			doc: Document{
				ProjectID: "proj1",
				Title:     "Test Document",
				Type:      DocumentTypeHLD,
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

func docTypePtr(t DocumentType) *DocumentType {
	return &t
}
