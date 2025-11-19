from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.memory import router as memory_router

app = FastAPI(
    title="PAL Backend",
    version="1.0.0"
)

# include routers
app.include_router(health_router, prefix="/api")
app.include_router(memory_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "PAL Backend Running"}