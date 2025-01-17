// Package models internal/models/mockup.go
package models

import (
	"time"
)

type Mockup struct {
	ID        string    `bson:"_id,omitempty" json:"id"`
	ProjectID string    `bson:"project_id" json:"projectId"`
	Name      string    `bson:"name" json:"name"`
	Type      string    `bson:"type" json:"type"`
	Tool      string    `bson:"tool" json:"tool"`
	Thumbnail string    `bson:"thumbnail" json:"thumbnail"`
	Status    string    `bson:"status" json:"status"`
	CreatedBy string    `bson:"created_by" json:"createdBy"`
	CreatedAt time.Time `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time `bson:"updated_at" json:"updatedAt"`
}
