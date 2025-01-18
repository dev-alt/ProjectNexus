// internal/repository/token_store.go

package repository

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

// TokenStore interface for managing token blacklisting
type TokenStore interface {
	Blacklist(ctx context.Context, token string, expiration time.Duration) error
	IsBlacklisted(ctx context.Context, token string) (bool, error)
}

// RedisTokenStore implements TokenStore using Redis
type RedisTokenStore struct {
	client *redis.Client
}

func NewRedisTokenStore(client *redis.Client) TokenStore {
	return &RedisTokenStore{
		client: client,
	}
}

func (s *RedisTokenStore) Blacklist(ctx context.Context, token string, expiration time.Duration) error {
	key := "blacklist:" + token
	return s.client.Set(ctx, key, true, expiration).Err()
}

func (s *RedisTokenStore) IsBlacklisted(ctx context.Context, token string) (bool, error) {
	key := "blacklist:" + token
	exists, err := s.client.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return exists > 0, nil
}
