from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Any, Coroutine
import uvicorn
from algo import get_score_and_decision_based_on_id

app = FastAPI(
    title="PAX Underwriting AI Service",
    description="AI-powered underwriting analysis service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UnderwritingRequest(BaseModel):
    application_id: str
    applicant_data: dict
    risk_factors: Optional[dict] = None

class UnderwritingResponse(BaseModel):
    application_id: str
    risk_score: float
    recommendation: str
    confidence: float
    analysis: dict

@app.get("/")
async def root():
    return {
        "service": "PAX Underwriting AI",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "algo-backend"
    }

@app.get("/score_and_result/{user_id}/{offering_id}")
async def score(user_id: str, offering_id: str) -> dict[str, Any]:
    score_, result = get_score_and_decision_based_on_id(user_id, offering_id)
    return {
        "score": score_,
        "result": result
    }

@app.post("/api/analyze", response_model=UnderwritingResponse)
async def analyze_underwriting(request: UnderwritingRequest):
    """
    Analyze an underwriting application using AI.
    This is a placeholder implementation.
    """
    try:
        # Placeholder AI analysis logic
        # TODO: Call here AI model 
        risk_score = 0.65  # Mock score

        recommendation = "APPROVE" if risk_score < 0.7 else "REVIEW"

        return UnderwritingResponse(
            application_id=request.application_id,
            risk_score=risk_score,
            recommendation=recommendation,
            confidence=0.85,
            analysis={
                "factors_analyzed": ["credit_score", "employment_history", "debt_ratio"],
                "key_findings": "Application shows moderate risk profile"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models")
async def list_models():
    """List available AI models"""
    return {
        "models": [
            {
                "id": "underwriting-v1",
                "name": "Underwriting Model v1",
                "status": "active"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )
