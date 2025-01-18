// Package services internal/services/auth.go
package services

import (
	"context"
	stderrors "errors"
	"fmt"
	"log"
	"projectnexus/internal/errors"
	"projectnexus/internal/models"
	"projectnexus/internal/repository"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService interface {
	Register(ctx context.Context, input models.RegisterInput) (*models.AuthResponse, error)
	Login(ctx context.Context, input models.LoginInput) (*models.AuthResponse, error)
	ValidateToken(token string) (*models.User, error)
	RefreshToken(ctx context.Context, token string) (*models.AuthResponse, error)
	Logout(ctx context.Context, token string) error
}

type authService struct {
	userRepo   repository.UserRepository
	jwtSecret  []byte
	tokenStore repository.TokenStore
}

func NewAuthService(userRepo repository.UserRepository, jwtSecret string, tokenStore repository.TokenStore) AuthService {
	return &authService{
		userRepo:   userRepo,
		jwtSecret:  []byte(jwtSecret),
		tokenStore: tokenStore,
	}
}

func (s *authService) Register(ctx context.Context, input models.RegisterInput) (*models.AuthResponse, error) {
	// Check if user exists
	existing, err := s.userRepo.GetByEmail(ctx, input.Email)
	if err == nil && existing != nil {
		return nil, errors.ErrUserExists // Correctly using custom error
	}

	// Create new user
	user := &models.User{
		Email: input.Email,
		Name:  input.Name,
	}

	if err := user.SetPassword(input.Password); err != nil {
		return nil, err
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Generate JWT token
	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *authService) Login(ctx context.Context, input models.LoginInput) (*models.AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, input.Email)
	if err != nil {
		return nil, errors.ErrInvalidCredentials // Correctly using custom error
	}

	if !user.CheckPassword(input.Password) {
		return nil, errors.ErrInvalidCredentials // Correctly using custom error
	}

	// Generate JWT token
	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *authService) ValidateToken(tokenString string) (*models.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return s.jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.ErrInvalidToken // Correctly using custom error
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, stderrors.New("invalid token claims")
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return nil, stderrors.New("invalid user id in token")
	}

	user, err := s.userRepo.GetByID(context.Background(), userID)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *authService) generateToken(user *models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	return token.SignedString(s.jwtSecret)
}

// RefreshToken implementation
func (s *authService) RefreshToken(ctx context.Context, token string) (*models.AuthResponse, error) {
	// Validate the existing token
	user, err := s.ValidateToken(token)
	if err != nil {
		return nil, err
	}

	// Check if token is blacklisted
	isBlacklisted, err := s.tokenStore.IsBlacklisted(ctx, token)
	if err != nil {
		return nil, err
	}
	if isBlacklisted {
		return nil, errors.ErrInvalidToken
	}

	// Generate new token
	newToken, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Token: newToken,
		User:  user,
	}, nil
}

// Logout implementation
func (s *authService) Logout(ctx context.Context, token string) error {
	if s.tokenStore == nil {
		log.Println("TokenStore is nil")
		return fmt.Errorf("token store not initialized")
	}

	// Validate the token first
	_, err := s.ValidateToken(token)
	if err != nil {
		log.Printf("Token validation failed: %v\n", err)
		return err
	}

	// Parse the token to get expiration time
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return s.jwtSecret, nil
	})
	if err != nil {
		log.Printf("Token parsing failed: %v\n", err)
		return err
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok {
		log.Println("Failed to parse token claims")
		return errors.ErrInvalidToken
	}

	exp, ok := claims["exp"].(float64)
	if !ok {
		log.Println("Failed to get expiration from token")
		return errors.ErrInvalidToken
	}

	expTime := time.Unix(int64(exp), 0)
	timeUntilExp := time.Until(expTime)

	// Add token to blacklist
	if err := s.tokenStore.Blacklist(ctx, token, timeUntilExp); err != nil {
		log.Printf("Failed to blacklist token: %v\n", err)
		return fmt.Errorf("failed to blacklist token: %w", err)
	}

	return nil
}
