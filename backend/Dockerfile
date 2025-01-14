FROM golang:1.23.4-alpine AS builder

WORKDIR /app

# Install git (if needed for private repos)
RUN apk add --no-cache git

# Download dependencies (cache this layer separately)
COPY go.mod go.sum ./
RUN go mod download

# Copy only necessary Go source files and directories
COPY cmd ./cmd
COPY internal ./internal 
# Add other directories containing your Go source code here

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