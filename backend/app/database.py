# backend/app/database.py
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "pal.db"

def get_db():
    # create/connect per-call; no thread reuse
    conn = sqlite3.connect(DB_PATH.as_posix())
    conn.row_factory = sqlite3.Row
    return conn
