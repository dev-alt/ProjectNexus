// internal/api/handlers/document.go
package handlers

import (
	"net/http"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"projectnexus/internal/services"

	"github.com/gin-gonic/gin"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("userID") // Set by auth middleware
	doc, err := h.documentService.CreateDocument(c.Request.Context(), input, userID)
	if err != nil {
		switch err {
		case repository.ErrProjectNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case repository.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to create documents in this project"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create document"})
		}
		return
	}

	c.JSON(http.StatusCreated, doc)
}

// GetDocument handles retrieving a single document
func (h *DocumentHandler) GetDocument(c *gin.Context) {
	documentID := c.Param("id")
	userID := c.GetString("userID")

	doc, err := h.documentService.GetDocument(c.Request.Context(), documentID, userID)
	if err != nil {
		switch err {
		case repository.ErrDocumentNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		case repository.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to access this document"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get document"})
		}
		return
	}

	c.JSON(http.StatusOK, doc)
}

// UpdateDocument handles document updates
func (h *DocumentHandler) UpdateDocument(c *gin.Context) {
	documentID := c.Param("id")
	userID := c.GetString("userID")

	var input models.UpdateDocumentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	doc, err := h.documentService.UpdateDocument(c.Request.Context(), documentID, input, userID)
	if err != nil {
		switch err {
		case repository.ErrDocumentNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		case repository.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this document"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update document"})
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
		switch err {
		case repository.ErrDocumentNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		case repository.ErrUnauthorized:
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

	docs, err := h.documentService.GetProjectDocuments(c.Request.Context(), projectID, userID)
	if err != nil {
		switch err {
		case repository.ErrProjectNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case repository.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to access project documents"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get project documents"})
		}
		return
	}

	c.JSON(http.StatusOK, docs)
}

// GetDocumentVersions handles retrieving version history of a document
func (h *DocumentHandler) GetDocumentVersions(c *gin.Context) {
	documentID := c.Param("id")
	userID := c.GetString("userID")

	versions, err := h.documentService.GetDocumentVersions(c.Request.Context(), documentID, userID)
	if err != nil {
		switch err {
		case repository.ErrDocumentNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		case repository.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to access document versions"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get document versions"})
		}
		return
	}

	c.JSON(http.StatusOK, versions)
}
