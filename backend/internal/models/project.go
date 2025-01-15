package models

import (
	"fmt"
	"strings"
	"time"
)

type ProjectStatus string

const (
	ProjectStatusPlanning   ProjectStatus = "Planning"
	ProjectStatusInProgress ProjectStatus = "In Progress"
	ProjectStatusReview     ProjectStatus = "Review"
	ProjectStatusCompleted  ProjectStatus = "Completed"
)

// IsValid ValidateProjectStatus checks if the given status is valid
func (s ProjectStatus) IsValid() bool {
	switch s {
	case ProjectStatusPlanning,
		ProjectStatusInProgress,
		ProjectStatusReview,
		ProjectStatusCompleted:
		return true
	default:
		return false
	}
}

type Project struct {
	ID          string        `bson:"_id,omitempty" json:"id"`
	Name        string        `bson:"name" json:"name"`
	Description string        `bson:"description" json:"description"`
	Status      ProjectStatus `bson:"status" json:"status"`
	Progress    int           `bson:"progress" json:"progress"`
	Team        []string      `bson:"team" json:"team"` // User IDs
	CreatedBy   string        `bson:"created_by" json:"createdBy"`
	CreatedAt   time.Time     `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time     `bson:"updated_at" json:"updatedAt"`
}

func (p *Project) Validate() error {
	if !p.Status.IsValid() {
		return fmt.Errorf("invalid project status: %s", p.Status)
	}
	if p.Progress < 0 || p.Progress > 100 {
		return fmt.Errorf("progress must be between 0 and 100")
	}
	return nil
}

type CreateProjectInput struct {
	Name        string        `json:"name" binding:"required"`
	Description string        `json:"description" binding:"required"`
	Status      ProjectStatus `json:"status" binding:"required"`
}

func (i *CreateProjectInput) Validate() error {
	if strings.TrimSpace(i.Name) == "" {
		return fmt.Errorf("name is required")
	}
	if strings.TrimSpace(i.Description) == "" {
		return fmt.Errorf("description is required")
	}
	if !i.Status.IsValid() {
		return fmt.Errorf("invalid project status: %s", i.Status)
	}
	return nil
}

type UpdateProjectInput struct {
	Name        *string        `json:"name,omitempty"`
	Description *string        `json:"description,omitempty"`
	Status      *ProjectStatus `json:"status,omitempty"`
	Progress    *int           `json:"progress,omitempty"`
}

func (i *UpdateProjectInput) Validate() error {
	if i.Status != nil && !i.Status.IsValid() {
		return fmt.Errorf("invalid project status: %s", *i.Status)
	}
	if i.Progress != nil && (*i.Progress < 0 || *i.Progress > 100) {
		return fmt.Errorf("progress must be between 0 and 100")
	}
	return nil
}
