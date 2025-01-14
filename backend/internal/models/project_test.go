// internal/models/project_test.go
package models

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func statusPtr(s ProjectStatus) *ProjectStatus {
	return &s
}

func intPtr(i int) *int {
	return &i
}
func TestProjectStatus_IsValid(t *testing.T) {
	tests := []struct {
		name   string
		status ProjectStatus
		want   bool
	}{
		{
			name:   "valid status - planning",
			status: ProjectStatusPlanning,
			want:   true,
		},
		{
			name:   "valid status - in progress",
			status: ProjectStatusInProgress,
			want:   true,
		},
		{
			name:   "valid status - review",
			status: ProjectStatusReview,
			want:   true,
		},
		{
			name:   "valid status - completed",
			status: ProjectStatusCompleted,
			want:   true,
		},
		{
			name:   "invalid status",
			status: ProjectStatus("Invalid Status"),
			want:   false,
		},
		{
			name:   "empty status",
			status: ProjectStatus(""),
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
		project Project
		wantErr bool
	}{
		{
			name: "valid project",
			project: Project{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      ProjectStatusPlanning,
				Progress:    0,
				Team:        []string{"user1", "user2"},
				CreatedBy:   "user1",
			},
			wantErr: false,
		},
		{
			name: "invalid status",
			project: Project{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      ProjectStatus("Invalid"),
				Progress:    0,
				Team:        []string{"user1"},
				CreatedBy:   "user1",
			},
			wantErr: true,
		},
		{
			name: "invalid progress - negative",
			project: Project{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      ProjectStatusPlanning,
				Progress:    -1,
				Team:        []string{"user1"},
				CreatedBy:   "user1",
			},
			wantErr: true,
		},
		{
			name: "invalid progress - over 100",
			project: Project{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      ProjectStatusPlanning,
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
		input CreateProjectInput
		valid bool
	}{
		{
			name: "valid input",
			input: CreateProjectInput{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      ProjectStatusPlanning,
			},
			valid: true,
		},
		{
			name: "empty name",
			input: CreateProjectInput{
				Name:        "",
				Description: "Test Description",
				Status:      ProjectStatusPlanning,
			},
			valid: false,
		},
		{
			name: "empty description",
			input: CreateProjectInput{
				Name:        "Test Project",
				Description: "",
				Status:      ProjectStatusPlanning,
			},
			valid: false,
		},
		{
			name: "invalid status",
			input: CreateProjectInput{
				Name:        "Test Project",
				Description: "Test Description",
				Status:      ProjectStatus("Invalid"),
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
		input UpdateProjectInput
		valid bool
	}{
		{
			name: "valid input - all fields",
			input: UpdateProjectInput{
				Name:        stringPtr("Updated Project"),
				Description: stringPtr("Updated Description"),
				Status:      statusPtr(ProjectStatusInProgress),
				Progress:    intPtr(50),
			},
			valid: true,
		},
		{
			name: "valid input - partial update",
			input: UpdateProjectInput{
				Name:     stringPtr("Updated Project"),
				Progress: intPtr(75),
			},
			valid: true,
		},
		{
			name: "invalid progress",
			input: UpdateProjectInput{
				Progress: intPtr(101),
			},
			valid: false,
		},
		{
			name: "invalid status",
			input: UpdateProjectInput{
				Status: statusPtr(ProjectStatus("Invalid")),
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
