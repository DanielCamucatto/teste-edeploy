import sqlite3
from datetime import datetime
from typing import List, Dict, Any

DATABASE_PATH = "teste_tecnico.db"

def init_database():
    """Inicializa o banco de dados com as tabelas necessárias."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Tabela para Pergunta 1 (Strings)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pergunta1_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            texto TEXT NOT NULL,
            valido BOOLEAN NOT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Tabela para Pergunta 2 (Sequências)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pergunta2_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            posicao INTEGER NOT NULL,
            valor INTEGER NOT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Tabela para Pergunta 3 (Tabuleiro)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pergunta3_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            casas INTEGER NOT NULL,
            turnos_minimos INTEGER NOT NULL,
            probabilidade REAL NOT NULL,
            combinacoes INTEGER NOT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Tabela para Pergunta 4 (Rescisão)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pergunta4_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_admissao DATE NOT NULL,
            data_demissao DATE NOT NULL,
            salario REAL NOT NULL,
            decimo_terceiro REAL NOT NULL,
            ferias REAL NOT NULL,
            total REAL NOT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()

# Pergunta 1
def save_q1_result(texto: str, valido: bool):
    """Salva resultado da Pergunta 1 no banco."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO pergunta1_history (texto, valido) VALUES (?, ?)",
        (texto, valido)
    )
    conn.commit()
    conn.close()

def get_q1_history() -> List[Dict[str, Any]]:
    """Recupera histórico da Pergunta 1."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pergunta1_history ORDER BY criado_em DESC LIMIT 10")
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

# Pergunta 2
def save_q2_result(posicao: int, valor: int):
    """Salva resultado da Pergunta 2 no banco."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO pergunta2_history (posicao, valor) VALUES (?, ?)",
        (posicao, valor)
    )
    conn.commit()
    conn.close()

def get_q2_history() -> List[Dict[str, Any]]:
    """Recupera histórico da Pergunta 2."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pergunta2_history ORDER BY criado_em DESC LIMIT 10")
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

# Pergunta 3
def save_q3_result(casas: int, turnos_minimos: int, probabilidade: float, combinacoes: int):
    """Salva resultado da Pergunta 3 no banco."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO pergunta3_history (casas, turnos_minimos, probabilidade, combinacoes) VALUES (?, ?, ?, ?)",
        (casas, turnos_minimos, probabilidade, combinacoes)
    )
    conn.commit()
    conn.close()

def get_q3_history() -> List[Dict[str, Any]]:
    """Recupera histórico da Pergunta 3."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pergunta3_history ORDER BY criado_em DESC LIMIT 10")
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

# Pergunta 4
def save_q4_result(data_admissao: str, data_demissao: str, salario: float, 
                   decimo_terceiro: float, ferias: float, total: float):
    """Salva resultado da Pergunta 4 no banco."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO pergunta4_history 
           (data_admissao, data_demissao, salario, decimo_terceiro, ferias, total) 
           VALUES (?, ?, ?, ?, ?, ?)""",
        (data_admissao, data_demissao, salario, decimo_terceiro, ferias, total)
    )
    conn.commit()
    conn.close()

def get_q4_history() -> List[Dict[str, Any]]:
    """Recupera histórico da Pergunta 4."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pergunta4_history ORDER BY criado_em DESC LIMIT 10")
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results
