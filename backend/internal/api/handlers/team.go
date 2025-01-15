// internal/api/handlers/team.go
package handlers

import (
	"log"
	"net/http"
	"projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"projectnexus/internal/services"

	"github.com/gin-gonic/gin"
)

type TeamHandler struct {
	teamService services.TeamService
}

func NewTeamHandler(teamService services.TeamService) *TeamHandler {
	return &TeamHandler{
		teamService: teamService,
	}
}

// AddTeamMember handles adding a new team member to a project
func (h *TeamHandler) AddTeamMember(c *gin.Context) {
	projectID := c.Param("projectId")
	adderID := c.GetString("userID")

	var input models.AddTeamMemberInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input format"})
		return
	}

	member, err := h.teamService.AddTeamMember(c.Request.Context(), projectID, input, adderID)
	if err != nil {
		log.Printf("Error adding team member: %v", err)
		switch err {
		case errors.ErrProjectNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.ErrUserNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		case errors.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to add team members"})
		case errors.ErrAlreadyInTeam:
			c.JSON(http.StatusConflict, gin.H{"error": "User is already a team member"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add team member"})
		}
		return
	}

	c.JSON(http.StatusCreated, member)
}

// UpdateTeamMember handles updating a team member's role or status
func (h *TeamHandler) UpdateTeamMember(c *gin.Context) {
	memberID := c.Param("id")
	updaterID := c.GetString("userID")

	var input models.UpdateTeamMemberInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input format"})
		return
	}

	if err := input.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	member, err := h.teamService.UpdateTeamMember(c.Request.Context(), memberID, input, updaterID)
	if err != nil {
		log.Printf("Error updating team member: %v", err)
		switch err {
		case errors.ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Team member not found"})
		case errors.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update team members"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update team member"})
		}
		return
	}

	c.JSON(http.StatusOK, member)
}

// RemoveTeamMember handles removing a team member from a project
func (h *TeamHandler) RemoveTeamMember(c *gin.Context) {
	memberID := c.Param("id")
	removerID := c.GetString("userID")

	err := h.teamService.RemoveTeamMember(c.Request.Context(), memberID, removerID)
	if err != nil {
		log.Printf("Error removing team member: %v", err)
		switch err {
		case errors.ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Team member not found"})
		case errors.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to remove team members"})
		case errors.ErrCannotRemoveOwner:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot remove project owner from team"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove team member"})
		}
		return
	}

	c.Status(http.StatusNoContent)
}

// GetTeamMember handles retrieving a single team member
func (h *TeamHandler) GetTeamMember(c *gin.Context) {
	memberID := c.Param("id")

	member, err := h.teamService.GetTeamMember(c.Request.Context(), memberID)
	if err != nil {
		log.Printf("Error getting team member: %v", err)
		switch err {
		case errors.ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Team member not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get team member"})
		}
		return
	}

	c.JSON(http.StatusOK, member)
}

// GetProjectTeam handles retrieving all team members for a project
func (h *TeamHandler) GetProjectTeam(c *gin.Context) {
	projectID := c.Param("projectId")

	members, err := h.teamService.GetProjectTeam(c.Request.Context(), projectID)
	if err != nil {
		log.Printf("Error getting project team: %v", err)
		switch err {
		case repository.ErrNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get project team"})
		}
		return
	}

	if members == nil {
		members = make([]*models.TeamMember, 0)
	}

	c.JSON(http.StatusOK, members)
}
