package repository

import (
	"context"
	"projectnexus/internal/models"
)

type UserRepository interface {
	// Create creates a new user. Returns error if email already exists
	Create(ctx context.Context, user *models.User) error

	// GetByID retrieves a user by ID. Returns errors.ErrNotFound if user doesn't exist
	GetByID(ctx context.Context, id string) (*models.User, error)

	// GetByEmail retrieves a user by email. Returns errors.ErrNotFound if user doesn't exist
	GetByEmail(ctx context.Context, email string) (*models.User, error)

	// Update updates an existing user. Returns errors.ErrNotFound if user doesn't exist
	Update(ctx context.Context, user *models.User) error
}

type ProjectRepository interface {
	Create(ctx context.Context, project *models.Project) error
	GetByID(ctx context.Context, id string) (*models.Project, error)
	GetByUser(ctx context.Context, userID string) ([]*models.Project, error)
	Update(ctx context.Context, project *models.Project) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, filter interface{}) ([]*models.Project, error)
}
type DocumentRepository interface {
	Create(ctx context.Context, document *models.Document) error
	CreateVersion(ctx context.Context, version *models.DocumentVersion) error
	GetByID(ctx context.Context, id string) (*models.Document, error)
	GetByProject(ctx context.Context, projectID string) ([]*models.Document, error)
	Update(ctx context.Context, document *models.Document) error
	Delete(ctx context.Context, id string) error
	GetVersions(ctx context.Context, documentID string) ([]*models.DocumentVersion, error)
}
type TeamRepository interface {
	Create(ctx context.Context, member *models.TeamMember) error
	GetByID(ctx context.Context, id string) (*models.TeamMember, error)
	GetByProjectAndUser(ctx context.Context, projectID, userID string) (*models.TeamMember, error)
	GetProjectMembers(ctx context.Context, projectID string) ([]*models.TeamMember, error)
	Update(ctx context.Context, member *models.TeamMember) error
	Delete(ctx context.Context, id string) error
}
