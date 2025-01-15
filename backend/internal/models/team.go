// Package models internal/models/team.go
package models

import (
	"errors"
	"time"
)

type TeamRole string

const (
	TeamRoleOwner  TeamRole = "owner"
	TeamRoleMember TeamRole = "member"
	TeamRoleViewer TeamRole = "viewer"
)

type TeamMemberStatus string

const (
	TeamMemberStatusActive   TeamMemberStatus = "active"
	TeamMemberStatusInactive TeamMemberStatus = "inactive"
)

type TeamMember struct {
	ID          string           `bson:"_id,omitempty" json:"id"`
	UserID      string           `bson:"user_id" json:"userId"`
	Name        string           `bson:"name" json:"name"`
	Description string           `bson:"description" json:"description"`
	Email       string           `bson:"email" json:"email"`
	Role        TeamRole         `bson:"role" json:"role"`
	Status      TeamMemberStatus `bson:"status" json:"status"`
	CreatedAt   time.Time        `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time        `bson:"updated_at" json:"updatedAt"`
	ProjectID   string           `bson:"project_id" json:"projectId"`
}

type Team struct {
	ID          string       `bson:"_id,omitempty" json:"id"`
	Name        string       `bson:"name" json:"name"`
	Description string       `bson:"description" json:"description"`
	Lead        string       `bson:"lead" json:"lead"`
	CreatedAt   time.Time    `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time    `bson:"updated_at" json:"updatedAt"`
	Members     []TeamMember `bson:"members" json:"members"`
}

type CreateTeamInput struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
}

type UpdateTeamInput struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
	Lead        *string `json:"lead,omitempty"`
}

type AddTeamMemberInput struct {
	UserID string   `json:"userId" binding:"required"`
	Role   TeamRole `json:"role" binding:"required"`
}

type UpdateTeamMemberInput struct {
	Role   *TeamRole         `json:"role,omitempty"`
	Status *TeamMemberStatus `json:"status,omitempty"`
}

func (r TeamRole) IsValid() bool {
	switch r {
	case TeamRoleOwner, TeamRoleMember, TeamRoleViewer:
		return true
	default:
		return false
	}
}

func (s TeamMemberStatus) IsValid() bool {
	switch s {
	case TeamMemberStatusActive, TeamMemberStatusInactive:
		return true
	default:
		return false
	}
}

func (i *AddTeamMemberInput) Validate() error {
	if i.UserID == "" {
		return errors.New("user ID is required")
	}
	if !i.Role.IsValid() {
		return errors.New("invalid team role")
	}
	return nil
}

func (i *UpdateTeamMemberInput) Validate() error {
	if i.Role != nil && !i.Role.IsValid() {
		return errors.New("invalid team role")
	}
	if i.Status != nil && !i.Status.IsValid() {
		return errors.New("invalid status")
	}
	return nil
}
