from fastapi import APIRouter
from app.services.memory_service import add_memory, get_memory

router = APIRouter()

@router.post("/memory/add")
def add_memory_api(data: dict):
    return add_memory(data["key"], data["value"])

@router.get("/memory/{key}")
def get_memory_api(key: str):
    return get_memory(key)