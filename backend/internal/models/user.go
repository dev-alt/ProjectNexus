package models

import (
    "time"
    "golang.org/x/crypto/bcrypt"
)

type User struct {
    ID           string    `bson:"_id,omitempty" json:"id"`
    Email        string    `bson:"email" json:"email"`
    PasswordHash string    `bson:"password_hash" json:"-"`
    Name         string    `bson:"name" json:"name"`
    CreatedAt    time.Time `bson:"created_at" json:"createdAt"`
    UpdatedAt    time.Time `bson:"updated_at" json:"updatedAt"`
}

func (u *User) SetPassword(password string) error {
    hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    u.PasswordHash = string(hash)
    return nil
}

func (u *User) CheckPassword(password string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
    return err == nil
}