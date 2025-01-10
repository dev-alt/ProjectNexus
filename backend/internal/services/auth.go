﻿package services

import (
    "context"
    "errors"
    "time"
    "github.com/golang-jwt/jwt/v5"
    "github.com/dev-alt/projectnexus/backend/internal/models"
    "github.com/dev-alt/projectnexus/backend/internal/repository"
)

var (
    ErrInvalidCredentials = errors.New("invalid credentials")
    ErrUserExists        = errors.New("user already exists")
)

type AuthService struct {
    userRepo repository.UserRepository
    jwtSecret []byte
}

type RegisterInput struct {
    Email    string
    Password string
    Name     string
}

type LoginInput struct {
    Email    string
    Password string
}

type AuthResponse struct {
    Token string      `json:"token"`
    User  *models.User `json:"user"`
}

func NewAuthService(userRepo repository.UserRepository, jwtSecret string) *AuthService {
    return &AuthService{
        userRepo:  userRepo,
        jwtSecret: []byte(jwtSecret),
    }
}

func (s *AuthService) Register(ctx context.Context, input RegisterInput) (*AuthResponse, error) {
    // Check if user exists
    existing, _ := s.userRepo.GetByEmail(ctx, input.Email)
    if existing != nil {
        return nil, ErrUserExists
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

    return &AuthResponse{
        Token: token,
        User:  user,
    }, nil
}

func (s *AuthService) Login(ctx context.Context, input LoginInput) (*AuthResponse, error) {
    user, err := s.userRepo.GetByEmail(ctx, input.Email)
    if err != nil {
        return nil, ErrInvalidCredentials
    }

    if !user.CheckPassword(input.Password) {
        return nil, ErrInvalidCredentials
    }

    // Generate JWT token
    token, err := s.generateToken(user)
    if err != nil {
        return nil, err
    }

    return &AuthResponse{
        Token: token,
        User:  user,
    }, nil
}

func (s *AuthService) ValidateToken(tokenString string) (*models.User, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return s.jwtSecret, nil
    })

    if err != nil || !token.Valid {
        return nil, err
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok {
        return nil, errors.New("invalid token claims")
    }

    userID, ok := claims["user_id"].(string)
    if !ok {
        return nil, errors.New("invalid user id in token")
    }

    user, err := s.userRepo.GetByID(context.Background(), userID)
    if err != nil {
        return nil, err
    }

    return user, nil
}

func (s *AuthService) generateToken(user *models.User) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "email":   user.Email,
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
    })

    return token.SignedString(s.jwtSecret)
}