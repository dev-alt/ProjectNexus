package handlers

import (
	"errors"
	"log"
	"net/http"
	internalerrors "projectnexus/internal/errors"
	"projectnexus/internal/models"
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
func (h *TeamHandler) CreateTeam(c *gin.Context) {
	var input models.CreateTeamInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input format"})
		return
	}

	userID := c.GetString("userID")
	team, err := h.teamService.CreateTeam(c.Request.Context(), input, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team"})
		return
	}

	c.JSON(http.StatusCreated, team)
}

func (h *TeamHandler) GetAllTeams(c *gin.Context) {
	teams, err := h.teamService.GetAllTeams(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch teams"})
		return
	}

	c.JSON(http.StatusOK, teams)
}
func (h *TeamHandler) GetTeam(c *gin.Context) {
	teamID := c.Param("id")
	team, err := h.teamService.GetTeamByID(c.Request.Context(), teamID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Team not found"})
		return
	}

	c.JSON(http.StatusOK, team)
}

func (h *TeamHandler) UpdateTeam(c *gin.Context) {
	teamID := c.Param("id")
	var input models.UpdateTeamInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input format"})
		return
	}

	team, err := h.teamService.UpdateTeam(c.Request.Context(), teamID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update team"})
		return
	}

	c.JSON(http.StatusOK, team)
}

func (h *TeamHandler) DeleteTeam(c *gin.Context) {
	teamID := c.Param("id")
	err := h.teamService.DeleteTeam(c.Request.Context(), teamID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete team"})
		return
	}

	c.Status(http.StatusNoContent)
}

// AddTeamMember handles adding a new team member to a project
func (h *TeamHandler) AddTeamMember(c *gin.Context) {
	projectID := c.Param("id") // Changed from projectId to id
	adderID := c.GetString("userID")

	var input models.AddTeamMemberInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input format"})
		return
	}

	member, err := h.teamService.AddTeamMember(c.Request.Context(), projectID, input, adderID)
	if err != nil {
		log.Printf("Error adding team member: %v", err)

		switch {
		case errors.Is(err, internalerrors.ErrProjectNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		case errors.Is(err, internalerrors.ErrUserNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		case errors.Is(err, internalerrors.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to add team members"})
		case errors.Is(err, internalerrors.ErrAlreadyInTeam):
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
	projectID := c.Param("id")      // Get project ID from URL
	memberID := c.Param("memberId") // Changed from id to memberId
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

	member, err := h.teamService.UpdateTeamMember(c.Request.Context(), projectID, memberID, input, updaterID)
	if err != nil {
		log.Printf("Error updating team member: %v", err)

		switch {
		case errors.Is(err, internalerrors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Team member not found"})
		case errors.Is(err, internalerrors.ErrUnauthorized):
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
	projectID := c.Param("id")      // Get project ID from URL
	memberID := c.Param("memberId") // Changed from id to memberId
	removerID := c.GetString("userID")

	err := h.teamService.RemoveTeamMember(c.Request.Context(), projectID, memberID, removerID)
	if err != nil {
		log.Printf("Error removing team member: %v", err)

		switch {
		case errors.Is(err, internalerrors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "Team member not found"})
		case errors.Is(err, internalerrors.ErrUnauthorized):
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to remove team members"})
		case errors.Is(err, internalerrors.ErrCannotRemoveOwner):
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
	projectID := c.Param("id")      // Get project ID from URL
	memberID := c.Param("memberId") // Changed from id to memberId

	member, err := h.teamService.GetTeamMember(c.Request.Context(), projectID, memberID)
	if err != nil {
		log.Printf("Error getting team member: %v", err)

		switch {
		case errors.Is(err, internalerrors.ErrNotFound):
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
	projectID := c.Param("id") // Changed from projectId to id

	members, err := h.teamService.GetProjectTeam(c.Request.Context(), projectID)
	if err != nil {
		log.Printf("Error getting project team: %v", err)

		switch {
		case errors.Is(err, internalerrors.ErrNotFound):
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

func (h *TeamHandler) GetTeamMembers(context *gin.Context) {
	teamID := context.Param("id")
	members, err := h.teamService.GetTeamMembers(context.Request.Context(), teamID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch team members"})
		return
	}

	context.JSON(http.StatusOK, members)

}
