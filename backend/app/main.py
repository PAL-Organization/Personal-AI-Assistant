from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.memory import router as memory_router

app = FastAPI(title="PAL Backend", version="1.0.0")

# --- CORS for frontend dev (allow both localhost and 127.0.0.1)
# For development it's ok to allow all origins with "*", but prefer explicit list.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # "http://your-dev-host:5173"  # add other dev hosts if needed
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers AFTER middleware
app.include_router(health_router, prefix="/api")
app.include_router(memory_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "PAL Backend Running"}
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "chrome-extension://*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

