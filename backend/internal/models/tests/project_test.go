// internal/models/project_test.go
package tests

import (
	"github.com/stretchr/testify/assert"
	"projectnexus/internal/models"
	"testing"
)

func statusPtr(s models.ProjectStatus) *models.ProjectStatus {
	return &s
}

func intPtr(i int) *int {
	return &i
}
func TestProjectStatus_IsValid(t *testing.T) {
	tests := []struct {
		name   string
		status models.ProjectStatus
		want   bool
	}{
		{
			name:   "valid status - planning",
			status: models.ProjectStatusPlanning,
			want:   true,
		},
		{
			name:   "valid status - in progress",
			status: models.ProjectStatusInProgress,
			want:   true,
		},
		{
			name:   "valid status - review",
			status: models.ProjectStatusReview,
			want:   true,
		},
		{
			name:   "valid status - completed",
			status: models.ProjectStatusCompleted,
			want:   true,
		},
		{
			name:   "invalid status",
			status: models.ProjectStatus("Invalid Status"),
			want:   false,
		},
		{
			name:   "empty status",
			status: models.ProjectStatus(""),
			want:   false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, tt.status.IsValid())
		})
	}
}

func TestProject_Validation(t *testing.T) {
	tests := []struct {
		name    string
		project models.Project
		wantErr bool
	}{
		{
			name: "valid project",
			project: models.Project{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      models.ProjectStatusPlanning,
				Progress:    0,
				Team:        []string{"user1", "user2"},
				CreatedBy:   "user1",
			},
			wantErr: false,
		},
		{
			name: "invalid status",
			project: models.Project{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      models.ProjectStatus("Invalid"),
				Progress:    0,
				Team:        []string{"user1"},
				CreatedBy:   "user1",
			},
			wantErr: true,
		},
		{
			name: "invalid progress - negative",
			project: models.Project{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      models.ProjectStatusPlanning,
				Progress:    -1,
				Team:        []string{"user1"},
				CreatedBy:   "user1",
			},
			wantErr: true,
		},
		{
			name: "invalid progress - over 100",
			project: models.Project{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      models.ProjectStatusPlanning,
				Progress:    101,
				Team:        []string{"user1"},
				CreatedBy:   "user1",
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.project.Validate()
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestCreateProjectInput_Validation(t *testing.T) {
	tests := []struct {
		name  string
		input models.CreateProjectInput
		valid bool
	}{
		{
			name: "valid input",
			input: models.CreateProjectInput{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      models.ProjectStatusPlanning,
			},
			valid: true,
		},
		{
			name: "empty name",
			input: models.CreateProjectInput{
				Name:        "",
				Description: "Test Description",
				Status:      models.ProjectStatusPlanning,
			},
			valid: false,
		},
		{
			name: "empty description",
			input: models.CreateProjectInput{
				Name:        "Test Project",
				Description: "",
				Status:      models.ProjectStatusPlanning,
			},
			valid: false,
		},
		{
			name: "invalid status",
			input: models.CreateProjectInput{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      models.ProjectStatus("Invalid"),
			},
			valid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.input.Validate()
			if tt.valid {
				assert.NoError(t, err)
			} else {
				assert.Error(t, err)
			}
		})
	}
}

func TestUpdateProjectInput_Validation(t *testing.T) {
	tests := []struct {
		name  string
		input models.UpdateProjectInput
		valid bool
	}{
		{
			name: "valid input - all fields",
			input: models.UpdateProjectInput{
				Name:        stringPtr("Updated Project"),
				Description: stringPtr("Updated Description"),
				Status:      statusPtr(models.ProjectStatusInProgress),
				Progress:    intPtr(50),
			},
			valid: true,
		},
		{
			name: "valid input - partial update",
			input: models.UpdateProjectInput{
				Name:     stringPtr("Updated Project"),
				Progress: intPtr(75),
			},
			valid: true,
		},
		{
			name: "invalid progress",
			input: models.UpdateProjectInput{
				Progress: intPtr(101),
			},
			valid: false,
		},
		{
			name: "invalid status",
			input: models.UpdateProjectInput{
				Status: statusPtr("Invalid"),
			},
			valid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.input.Validate()
			if tt.valid {
				assert.NoError(t, err)
			} else {
				assert.Error(t, err)
			}
		})
	}
}
