// internal/models/project.go
package models

import "time"

type ProjectStatus string

const (
	ProjectStatusPlanning   ProjectStatus = "Planning"
	ProjectStatusInProgress ProjectStatus = "In Progress"
	ProjectStatusReview     ProjectStatus = "Review"
	ProjectStatusCompleted  ProjectStatus = "Completed"
)

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

type CreateProjectInput struct {
	Name        string        `json:"name" binding:"required"`
	Description string        `json:"description" binding:"required"`
	Status      ProjectStatus `json:"status" binding:"required"`
}

type UpdateProjectInput struct {
	Name        *string        `json:"name,omitempty"`
	Description *string        `json:"description,omitempty"`
	Status      *ProjectStatus `json:"status,omitempty"`
	Progress    *int           `json:"progress,omitempty"`
}
