from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from contextlib import asynccontextmanager

from logic import (
    validate_string_ba,
    calculate_sequence_value,
    calculate_board_stats,
    calculate_severance
)
from database import (
    init_database,
    save_q1_result,
    get_q1_history,
    save_q2_result,
    get_q2_history,
    save_q3_result,
    get_q3_history,
    save_q4_result,
    get_q4_history
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Inicializa o banco de dados
    init_database()
    yield
    # Shutdown: Aqui você pode fazer limpeza se necessário
    pass

app = FastAPI(
    title="API - Teste Técnico 3S",
    description="API com as lógicas de negócio do teste de Backend (Python).",
    version="1.0.0",
    lifespan=lifespan
)

# Configurando CORS para permitir o Front-end (React) consumir essa API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Na produção substitua pelo domínio do Netlify/Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- MODELOS (PAYLOADS) ---- #
class StringPayload(BaseModel):
    texto: str

class SequenciaPayload(BaseModel):
    posicao: int

class TabuleiroPayload(BaseModel):
    casas: int

class RescisaoPayload(BaseModel):
    data_admissao: str # Formato YYYY-MM-DD
    data_demissao: str # Formato YYYY-MM-DD
    salario: float


# ---- ENDPOINTS ---- #

@app.get("/")
def root():
    return {"status": "ok", "mensagem": "API Funcionando!"}

@app.post("/api/q1-string")
def endpoint_q1_string(payload: StringPayload):
    resultado = validate_string_ba(payload.texto)
    save_q1_result(payload.texto, resultado)
    return {"texto": payload.texto, "valido": resultado}

@app.post("/api/q2-sequencia")
def endpoint_q2_sequencia(payload: SequenciaPayload):
    try:
        resultado = calculate_sequence_value(payload.posicao)
        save_q2_result(payload.posicao, resultado)
        return {"posicao": payload.posicao, "valor": resultado}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/q3-tabuleiro")
def endpoint_q3_tabuleiro(payload: TabuleiroPayload):
    try:
        estatisticas = calculate_board_stats(payload.casas)
        save_q3_result(
            payload.casas,
            estatisticas["turnos_minimos"],
            estatisticas["probabilidade_caminho_otimo"],
            estatisticas["combinacoes_sem_looping"]
        )
        return estatisticas
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/q4-rescisao")
def endpoint_q4_rescisao(payload: RescisaoPayload):
    try:
        detalhes = calculate_severance(
            data_admissao_str=payload.data_admissao,
            data_demissao_str=payload.data_demissao,
            salario=payload.salario
        )
        save_q4_result(
            payload.data_admissao,
            payload.data_demissao,
            payload.salario,
            detalhes["decimo_terceiro_proporcional"],
            detalhes["ferias_proporcionais_com_terco"],
            detalhes["total_receber"]
        )
        return detalhes
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ---- ENDPOINTS DE HISTÓRICO ---- #

@app.get("/api/q1-history")
def endpoint_q1_history():
    """Recupera os últimos 10 testes da Pergunta 1."""
    return {"historico": get_q1_history()}

@app.get("/api/q2-history")
def endpoint_q2_history():
    """Recupera os últimos 10 testes da Pergunta 2."""
    return {"historico": get_q2_history()}

@app.get("/api/q3-history")
def endpoint_q3_history():
    """Recupera os últimos 10 testes da Pergunta 3."""
    return {"historico": get_q3_history()}

@app.get("/api/q4-history")
def endpoint_q4_history():
    """Recupera os últimos 10 testes da Pergunta 4."""
    return {"historico": get_q4_history()}
