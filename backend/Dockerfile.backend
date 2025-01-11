# Backend Dockerfile
FROM golang:1.23.4-alpine AS builder

WORKDIR /app

# Install git for private repos if needed
RUN apk add --no-cache git

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# Create final minimal image
FROM alpine:latest

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/main .

# Create non-root user
RUN adduser -D appuser
USER appuser

EXPOSE 8085

CMD ["./main"]