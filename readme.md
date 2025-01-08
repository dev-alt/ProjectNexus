# ProjectNexus

A comprehensive project planning and documentation platform built with Next.js and Go.

## Project Structure

```
projectnexus/
├── frontend/          # Next.js frontend application
└── backend/          # Go backend application
```

## Quick Start

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend (Go)

```bash
cd backend
go mod download
go run cmd/api/main.go
```

The backend API will be available at `http://localhost:8080`

## Development Setup

### Prerequisites

- Node.js 18+
- Go 1.21+
- MongoDB
- Git

### Environment Variables

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Backend (.env):
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/projectnexus
JWT_SECRET=your-jwt-secret
```

## Contributing

1. Clone the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
