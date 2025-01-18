// Package handlers internal/api/handlers/document.go
package handlers

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	errs "projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/services"
)

type DocumentHandler struct {
	documentService services.DocumentService
}

func NewDocumentHandler(documentService services.DocumentService) *DocumentHandler {
	return &DocumentHandler{
		documentService: documentService,
	}
}

// CreateDocument handles document creation
func (h *DocumentHandler) CreateDocument(c *gin.Context) {
	var input models.CreateDocumentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid request format: %v", err)})
		return
	}

	userID := c.GetString("userID")
	if userID == "" {
		log.Printf("No userID found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	doc, err := h.documentService.CreateDocument(c.Request.Context(), input, userID)
	if err != nil {
		log.Printf("Error creating document: %v", err)
		switch {
		case errors.Is(err, errs.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.Is(err, errs.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to create documents in this project"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create document: %v", err)})
		}
		return
	}

	c.JSON(http.StatusCreated, doc)
}

// GetDocument handles retrieving a single document
func (h *DocumentHandler) GetDocument(c *gin.Context) {
	documentID := c.Param("id")
	userID := c.GetString("userID")

	// Add debug logging
	log.Printf("GetDocument request - DocumentID: %s, UserID: %s", documentID, userID)

	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	doc, err := h.documentService.GetDocument(c.Request.Context(), documentID, userID)
	if err != nil {
		log.Printf("Error getting document: %v", err)
		switch {
		case errors.Is(err, errs.ErrDocumentNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		case errors.Is(err, errs.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Associated project not found"})
		case errors.Is(err, errs.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to access this document"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to get document",
				"details": err.Error(),
			})
		}
		return
	}

	c.JSON(http.StatusOK, doc)
}

// UpdateDocument handles document updates
func (h *DocumentHandler) UpdateDocument(c *gin.Context) {
	documentID := c.Param("id")
	userID := c.GetString("userID")

	// Add debug logging
	log.Printf("Updating document - ID: %s, UserID: %s", documentID, userID)

	var input models.UpdateDocumentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("Failed to bind JSON input: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid request format: %v", err)})
		return
	}

	// Add debug logging for input
	log.Printf("Update input: %+v", input)

	doc, err := h.documentService.UpdateDocument(c.Request.Context(), documentID, input, userID)
	if err != nil {
		log.Printf("Error updating document: %v", err)
		switch {
		case errors.Is(err, errs.ErrDocumentNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		case errors.Is(err, errs.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this document"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   fmt.Sprintf("Failed to update document: %v", err),
				"details": err.Error(),
			})
		}
		return
	}

	c.JSON(http.StatusOK, doc)
}

// DeleteDocument handles document deletion
func (h *DocumentHandler) DeleteDocument(c *gin.Context) {
	documentID := c.Param("id")
	userID := c.GetString("userID")

	err := h.documentService.DeleteDocument(c.Request.Context(), documentID, userID)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrDocumentNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		case errors.Is(err, errs.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this document"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete document"})
		}
		return
	}

	c.Status(http.StatusNoContent)
}

// ListDocuments handles listing all documents the user has access to
func (h *DocumentHandler) ListDocuments(c *gin.Context) {
	userID := c.GetString("userID")

	docs, err := h.documentService.ListDocuments(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list documents"})
		return
	}

	c.JSON(http.StatusOK, docs)
}

// GetProjectDocuments handles listing all documents in a specific project
func (h *DocumentHandler) GetProjectDocuments(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("userID")

	// Add debug logging
	log.Printf("GetProjectDocuments request - ProjectID: %s, UserID: %s", projectID, userID)

	docs, err := h.documentService.GetProjectDocuments(c.Request.Context(), projectID, userID)
	if err != nil {
		log.Printf("Error getting project documents: %v", err)
		switch {
		case errors.Is(err, errs.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.Is(err, errs.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to access project documents"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to get project documents",
				"details": err.Error(),
			})
		}
		return
	}

	if docs == nil {
		docs = []*models.Document{} // Return empty array instead of null
	}

	c.JSON(http.StatusOK, docs)
}

// GetDocumentVersions handles retrieving version history of a document
func (h *DocumentHandler) GetDocumentVersions(c *gin.Context) {
	documentID := c.Param("id")
	userID := c.GetString("userID")

	versions, err := h.documentService.GetDocumentVersions(c.Request.Context(), documentID, userID)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrDocumentNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		case errors.Is(err, errs.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to access document versions"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get document versions"})
		}
		return
	}

	c.JSON(http.StatusOK, versions)
}
