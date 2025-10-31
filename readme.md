# PAX Underwriting Platform

A comprehensive underwriting platform with AI-powered analysis capabilities built for BaselHack 2025.

## Architecture

The application consists of four main services:

1. **Frontend** (React) - User interface running on port 3000
2. **Backend** (Spring Boot/Java) - Main API service running on port 8080
3. **Backend AI** (FastAPI/Python) - AI analysis service running on port 8001
4. **Database** (PostgreSQL) - Data persistence on port 5432

## Prerequisites

- Docker Desktop installed and running
- Git

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd baselhack25_pax_underwriting_A2
```

2. Build and start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- AI Service: http://localhost:8001
- API Documentation (AI): http://localhost:8001/docs

### Development Setup

#### Frontend (React)

```bash
cd code/frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000

#### Backend (Java/Spring Boot)

```bash
cd code/backend
./mvnw spring-boot:run
```

The backend will be available at http://localhost:8080

#### Backend AI (Python/FastAPI)

```bash
cd code/backend_ai
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

The AI service will be available at http://localhost:8001

## API Endpoints

### Backend (Java)
- `GET /api/health` - Health check
- `GET /api/info` - Service information
- `GET /actuator/health` - Spring Boot actuator health

### Backend AI (Python)
- `GET /` - Service information
- `GET /health` - Health check
- `POST /api/analyze` - Analyze underwriting application
- `GET /api/models` - List available AI models
- `GET /docs` - Interactive API documentation (Swagger UI)

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed:

```bash
cp .env.example .env
```

## Stopping Services

```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```

## Troubleshooting

### Port conflicts
If you see port conflict errors, ensure no other services are running on ports 3000, 8080, 8001, or 5432.

### Container health checks
Check the health status of services:
```bash
docker-compose ps
```

### View logs
View logs for all services:
```bash
docker-compose logs -f
```

View logs for a specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f backend-ai
docker-compose logs -f frontend
```

## License

See [license.txt](license.txt) for details.
