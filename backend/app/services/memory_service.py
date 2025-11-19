# backend/app/services/memory_service.py
from app.database import get_db
from app.models.memory_model import create_memory_table

def add_memory(key: str, value: str):
    conn = get_db()
    try:
        create_memory_table(conn)
        conn.execute(
            "INSERT OR REPLACE INTO memory (key, value) VALUES (?, ?)",
            (key, value)
        )
        conn.commit()
    finally:
        conn.close()
    return {"status": "saved"}

def get_memory(key: str):
    conn = get_db()
    try:
        create_memory_table(conn)
        cur = conn.execute("SELECT value FROM memory WHERE key=?", (key,))
        row = cur.fetchone()
        return {"value": row["value"] if row else None}
    finally:
        conn.close()
