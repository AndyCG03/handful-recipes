"""Esquemas Pydantic de las salidas de Spark (validación estricta)."""
from pydantic import BaseModel


class StepOut(BaseModel):
    start_sec: float
    end_sec: float
    action: str
    ingredients: list[str]
    informal_measure: str | None = None  # frase literal, jamás convertida a número


class GapOut(BaseModel):
    step_index: int
    kind: str
    question: str
    evidence: str  # por qué se considera hueco
