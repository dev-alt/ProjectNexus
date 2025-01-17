// Package handlers internal/api/mockup.go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"projectnexus/internal/models"
	"projectnexus/internal/services"
)

type MockupHandler struct {
	mockupService services.MockupService
}

func NewMockupHandler(mockupService services.MockupService) *MockupHandler {
	return &MockupHandler{mockupService: mockupService}
}

func (h *MockupHandler) CreateMockup(c *gin.Context) {
	var mockup models.Mockup
	if err := c.ShouldBindJSON(&mockup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID := c.GetString("userID")
	mockup.CreatedBy = userID

	if err := h.mockupService.CreateMockup(c, &mockup); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, mockup)
}

func (h *MockupHandler) GetMockup(c *gin.Context) {
	id := c.Param("id")

	mockup, err := h.mockupService.GetMockupByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mockup not found"})
		return
	}

	c.JSON(http.StatusOK, mockup)
}

func (h *MockupHandler) GetProjectMockups(c *gin.Context) {
	projectID := c.Param("projectId")

	mockups, err := h.mockupService.GetProjectMockups(c, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, mockups)
}

func (h *MockupHandler) UpdateMockup(c *gin.Context) {
	id := c.Param("id")

	var mockup models.Mockup
	if err := c.ShouldBindJSON(&mockup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mockup.ID = id

	if err := h.mockupService.UpdateMockup(c, &mockup); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, mockup)
}

func (h *MockupHandler) DeleteMockup(c *gin.Context) {
	id := c.Param("id")

	if err := h.mockupService.DeleteMockup(c, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *MockupHandler) ListMockups(c *gin.Context) {
	mockups, err := h.mockupService.ListMockups(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, mockups)
}
