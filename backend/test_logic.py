import sys
from logic import (
    validate_string_ba,
    calculate_sequence_value,
    calculate_board_stats,
    calculate_severance
)

def test_validate_string_ba():
    assert validate_string_ba("BA") is True
    assert validate_string_ba("BANA") is True
    assert validate_string_ba(" BANANA ") is True
    assert validate_string_ba("AB") is False
    assert validate_string_ba("Bola") is False
    assert validate_string_ba("") is False
    print("✅ test_validate_string_ba passou!")

def test_calculate_sequence_value():
    assert calculate_sequence_value(1) == 11
    assert calculate_sequence_value(2) == 18
    assert calculate_sequence_value(200) == 1404
    assert calculate_sequence_value(254) == 1782
    assert calculate_sequence_value(3542158) == 24795110
    
    try:
        calculate_sequence_value(0)
    except ValueError:
        pass # Esperado
    
    print("✅ test_calculate_sequence_value passou!")

def test_calculate_board_stats():
    # Para 3 casas: mínimo de turnos é 1 (tirou 3)
    stats3 = calculate_board_stats(3)
    assert stats3["turnos_minimos"] == 1
    assert stats3["combinacoes_sem_looping"] == 4 # 3 = 1+1+1, 1+2, 2+1, 3
    
    # Para 4 casas: mínimo de turnos é 2
    stats4 = calculate_board_stats(4)
    assert stats4["turnos_minimos"] == 2
    
    try:
        calculate_board_stats(2)
    except ValueError:
        pass # Esperado
        
    print("✅ test_calculate_board_stats passou!")

def test_calculate_severance():
    # 6 meses exatos trabalhados (2023-01-01 até 2023-07-01)
    # Como a pessoa sempre tira as férias no aniversário e zera o décimo na virada de ano:
    # Férias proporcionais = 6 meses (jan, fev, mar, abr, mai, jun) = 6000 de férias + 2000 de terço = 8000
    # 13º proporcional = demitido dia 01/07. Não completou 15 dias em julho, então ganha 6 meses = 6000.
    res = calculate_severance("2023-01-01", "2023-07-01", 12000.0)
    assert res["decimo_terceiro_proporcional"] == 6000.0
    assert res["ferias_proporcionais_com_terco"] == 8000.0
    assert res["total_receber"] == 14000.0

    # Teste para os 15 dias de carência contarem como o mês cheio
    res2 = calculate_severance("2023-01-01", "2023-02-16", 12000.0)
    assert res2["decimo_terceiro_proporcional"] == 2000.0
    
    print("✅ test_calculate_severance passou!")

if __name__ == "__main__":
    test_validate_string_ba()
    test_calculate_sequence_value()
    test_calculate_board_stats()
    test_calculate_severance()
    print("🚀 Todos os testes locais passaram com sucesso!")
