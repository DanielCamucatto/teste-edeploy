import math
import calendar
from datetime import datetime, date
from typing import Dict, Any


# =============================================================================
# Pergunta 1: String começa com 'B' e termina com 'A'
# =============================================================================

def validate_string_ba(texto: str) -> bool:
    """Verifica se a string começa com 'B' e termina com 'A' (case-insensitive)."""
    if not texto or not texto.strip():
        return False
    texto_limpo = texto.strip().upper()
    return texto_limpo.startswith('B') and texto_limpo.endswith('A')


# =============================================================================
# Pergunta 2: Progressão Aritmética (11, 18, 25, 32, 39...)
# =============================================================================

def calculate_sequence_value(posicao: int) -> int:
    """
    Retorna o valor na posição x de uma PA com:
      - Primeiro termo (a1) = 11
      - Razão (r) = 7
    Fórmula: a(n) = 11 + (n - 1) * 7
    """
    if not isinstance(posicao, int) or posicao < 1:
        raise ValueError("A posição deve ser um inteiro maior ou igual a 1")
    return 11 + (posicao - 1) * 7


# =============================================================================
# Pergunta 3: Jogo do Tabuleiro
# =============================================================================

def calculate_board_stats(tamanho_tabuleiro: int) -> Dict[str, Any]:
    """
    Dado um tabuleiro de N casas, retorna:
      1. Turnos mínimos para vencer (caminho ótimo).
      2. Probabilidade de executar o caminho ótimo.
      3. Número de combinações de movimentos sem nenhum looping.

    Regras:
      - Roleta sorteia 1, 2 ou 3 (equiprovável).
      - Se o número sorteado > casas restantes, o excedente recomeça do início (looping).
      - Tamanho mínimo: 3 casas.
    """
    if not isinstance(tamanho_tabuleiro, int) or tamanho_tabuleiro < 3:
        raise ValueError("O tamanho mínimo do tabuleiro deve ser 3 casas (inteiro)")

    N = tamanho_tabuleiro

    # 1. Turnos mínimos: andando sempre 3 por turno
    turnos_minimos = math.ceil(N / 3)

    # 3. Combinações sem looping (composições de N usando partes 1, 2 ou 3)
    memo_combs: Dict[int, int] = {}

    def combinacoes(alvo: int) -> int:
        if alvo == 0:
            return 1
        if alvo < 0:
            return 0
        if alvo in memo_combs:
            return memo_combs[alvo]
        resultado = combinacoes(alvo - 1) + combinacoes(alvo - 2) + combinacoes(alvo - 3)
        memo_combs[alvo] = resultado
        return resultado

    combinacoes_sem_loop = combinacoes(N)

    # 2. Probabilidade do caminho ótimo
    memo_prob: Dict[tuple, int] = {}

    def sequencias_otimas(alvo: int, turnos: int) -> int:
        """Conta sequências de `turnos` lances (1-3) que somam exatamente `alvo`."""
        if turnos == 0:
            return 1 if alvo == 0 else 0
        if alvo <= 0 or alvo > turnos * 3:
            return 0
        estado = (alvo, turnos)
        if estado in memo_prob:
            return memo_prob[estado]
        resultado = (
            sequencias_otimas(alvo - 1, turnos - 1)
            + sequencias_otimas(alvo - 2, turnos - 1)
            + sequencias_otimas(alvo - 3, turnos - 1)
        )
        memo_prob[estado] = resultado
        return resultado

    sucessos = sequencias_otimas(N, turnos_minimos)
    total_possivel = 3 ** turnos_minimos
    probabilidade = sucessos / total_possivel

    return {
        "turnos_minimos": turnos_minimos,
        "probabilidade_caminho_otimo": round(probabilidade, 6),
        "combinacoes_sem_looping": combinacoes_sem_loop,
        "detalhes_probabilidade": f"{sucessos}/{total_possivel} ({probabilidade:.2%})",
    }


# =============================================================================
# Pergunta 4: Rescisão — Férias Proporcionais e Décimo Terceiro
# =============================================================================

def _contar_meses_completos(inicio: date, fim: date) -> int:
    """
    Conta meses completos entre duas datas pelo calendário.
    Regra CLT: fração >= 15 dias conta como mês integral.
    """
    if fim < inicio:
        return 0

    meses = (fim.year - inicio.year) * 12 + (fim.month - inicio.month)

    dias_sobra = fim.day - inicio.day
    if dias_sobra < 0:
        meses -= 1
        if fim.month == 1:
            ano_ant, mes_ant = fim.year - 1, 12
        else:
            ano_ant, mes_ant = fim.year, fim.month - 1
        ultimo_dia = calendar.monthrange(ano_ant, mes_ant)[1]
        ultimo_dia_mes_anterior = date(ano_ant, mes_ant, ultimo_dia)
        dias_sobra = (fim - ultimo_dia_mes_anterior).days

    if dias_sobra >= 15:
        meses += 1

    return max(meses, 0)


def calculate_severance(
    data_admissao_str: str,
    data_demissao_str: str,
    salario: float,
) -> Dict[str, float]:
    """
    Calcula férias proporcionais (+ 1/3 constitucional) e décimo terceiro
    proporcional na rescisão.

    Regras:
      - Férias: reiniciam a cada aniversário de admissão.
      - Décimo Terceiro: reinicia a cada 1º de janeiro.
      - Fração de mês >= 15 dias conta como mês integral (CLT art. 146).

    Parâmetros
    ----------
    data_admissao_str : str   — formato "YYYY-MM-DD"
    data_demissao_str : str   — formato "YYYY-MM-DD"
    salario           : float — salário bruto mensal
    """
    fmt = "%Y-%m-%d"
    admissao = datetime.strptime(data_admissao_str, fmt).date()
    demissao = datetime.strptime(data_demissao_str, fmt).date()

    if demissao < admissao:
        raise ValueError("A data de demissão não pode ser anterior à admissão.")
    if salario <= 0:
        raise ValueError("O salário deve ser um valor positivo.")

    # Décimo Terceiro: de 01/jan do ano da demissão até a demissão
    inicio_ano = date(demissao.year, 1, 1)
    meses_decimo = min(_contar_meses_completos(inicio_ano, demissao), 12)
    valor_decimo = (salario / 12) * meses_decimo

    # Férias: do último aniversário de admissão até a demissão
    ano_ref = demissao.year
    try:
        ultimo_aniversario = date(ano_ref, admissao.month, admissao.day)
    except ValueError:
        ultimo_aniversario = date(ano_ref, admissao.month, 28)

    if ultimo_aniversario > demissao:
        ano_ref -= 1
        try:
            ultimo_aniversario = date(ano_ref, admissao.month, admissao.day)
        except ValueError:
            ultimo_aniversario = date(ano_ref, admissao.month, 28)

    meses_ferias = min(_contar_meses_completos(ultimo_aniversario, demissao), 11)
    valor_ferias_total = (salario / 12) * meses_ferias * (4 / 3)  # inclui 1/3 constitucional

    total = valor_decimo + valor_ferias_total

    return {
        "meses_decimo_terceiro": meses_decimo,
        "decimo_terceiro_proporcional": round(valor_decimo, 2),
        "meses_ferias": meses_ferias,
        "ferias_proporcionais_com_terco": round(valor_ferias_total, 2),
        "total_receber": round(total, 2),
    }