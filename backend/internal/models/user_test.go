package models

import (
    "testing"
)

func TestUser_SetPassword(t *testing.T) {
    user := &User{}
    password := "testpassword123"

    err := user.SetPassword(password)
    if err != nil {
        t.Errorf("SetPassword() error = %v", err)
    }

    if user.PasswordHash == "" {
        t.Error("SetPassword() did not set password hash")
    }

    if user.PasswordHash == password {
        t.Error("SetPassword() stored password as plaintext")
    }
}

func TestUser_CheckPassword(t *testing.T) {
    user := &User{}
    password := "testpassword123"

    _ = user.SetPassword(password)

    tests := []struct {
        name     string
        password string
        want     bool
    }{
        {
            name:     "correct password",
            password: password,
            want:     true,
        },
        {
            name:     "incorrect password",
            password: "wrongpassword",
            want:     false,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := user.CheckPassword(tt.password); got != tt.want {
                t.Errorf("CheckPassword() = %v, want %v", got, tt.want)
            }
        })
    }
}