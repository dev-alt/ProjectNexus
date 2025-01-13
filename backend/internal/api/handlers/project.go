// Package handlers internal/api/handlers/project.go
package handlers

import (
	"errors"
	"net/http"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"projectnexus/internal/services"

	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	projectService services.ProjectService
}

func NewProjectHandler(projectService services.ProjectService) *ProjectHandler {
	return &ProjectHandler{
		projectService: projectService,
	}
}

func (h *ProjectHandler) CreateProject(c *gin.Context) {
	var input models.CreateProjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("userID") // Set by auth middleware
	project, err := h.projectService.CreateProject(c.Request.Context(), input, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	c.JSON(http.StatusCreated, project)
}

func (h *ProjectHandler) GetProject(c *gin.Context) {
	projectID := c.Param("id")
	userID := c.GetString("userID")

	project, err := h.projectService.GetProject(c.Request.Context(), projectID, userID)
	if err != nil {
		switch { // Use switch without a tag
		case errors.Is(err, repository.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.Is(err, repository.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to access this project"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get project"})
		}
		return
	}

	c.JSON(http.StatusOK, project)
}

func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	projectID := c.Param("id")
	userID := c.GetString("userID")

	var input models.UpdateProjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project, err := h.projectService.UpdateProject(c.Request.Context(), projectID, input, userID)
	if err != nil {
		switch { // Use switch without a tag
		case errors.Is(err, repository.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.Is(err, repository.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this project"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
		}
		return
	}

	c.JSON(http.StatusOK, project)
}

func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	projectID := c.Param("id")
	userID := c.GetString("userID")

	err := h.projectService.DeleteProject(c.Request.Context(), projectID, userID)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.Is(err, repository.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this project"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		}
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *ProjectHandler) ListProjects(c *gin.Context) {
	userID := c.GetString("userID")

	projects, err := h.projectService.ListProjects(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list projects"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

func (h *ProjectHandler) AddTeamMember(c *gin.Context) {
	projectID := c.Param("id")
	userID := c.GetString("userID")

	var input struct {
		MemberID string `json:"memberId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.projectService.AddTeamMember(c.Request.Context(), projectID, input.MemberID, userID)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.Is(err, repository.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to modify team"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add team member"})
		}
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *ProjectHandler) RemoveTeamMember(c *gin.Context) {
	projectID := c.Param("id")
	memberID := c.Param("memberId")
	userID := c.GetString("userID")

	err := h.projectService.RemoveTeamMember(c.Request.Context(), projectID, memberID, userID)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.Is(err, repository.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to modify team"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove team member"})
		}
		return
	}

	c.Status(http.StatusNoContent)
}
