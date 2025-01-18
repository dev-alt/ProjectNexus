// Package errors internal/errors/errors.go
package errors

import "errors"

// Common errors
var (
	ErrNotFound     = errors.New("resource not found")
	ErrUnauthorized = errors.New("unauthorized")
	ErrInvalidInput = errors.New("invalid input")
)

// Auth errors
var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrUserExists         = errors.New("user already exists")
	ErrInvalidToken       = errors.New("invalid token")
	ErrTokenExpired       = errors.New("token expired")
)

// Project errors
var (
	ErrProjectNotFound = errors.New("project not found")
	ErrInvalidStatus   = errors.New("invalid project status")
)

// Document errors
var (
	ErrDocumentNotFound    = errors.New("document not found")
	ErrInvalidDocumentType = errors.New("invalid document type")
	ErrVersionNotFound     = errors.New("document version not found")
)

// Team errors
var (
	ErrUserNotFound      = errors.New("user not found")
	ErrAlreadyInTeam     = errors.New("user already in team")
	ErrNotInTeam         = errors.New("user not in team")
	ErrCannotRemoveOwner = errors.New("cannot remove project owner from team")
)
