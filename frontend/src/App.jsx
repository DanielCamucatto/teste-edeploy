import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  MonitorPlay,
  TerminalSquare,
  Binary,
  Calculator,
  BriefcaseBusiness,
  Trash2
} from 'lucide-react'

// O ideal em produção é usar variável de ambiente, mas como é um teste vamos deixar fixo por enquanto
// Caso o backend suba localmente via UVICORN, ele usará a porta 8000
const API_URL = 'http://localhost:8000/api'

function App() {
  const [activeTab, setActiveTab] = useState(1)

  // Estados Pergunta 1
  const [q1Text, setQ1Text] = useState('')
  const [q1Result, setQ1Result] = useState(null)

  // Estados Pergunta 2
  const [q2Pos, setQ2Pos] = useState('')
  const [q2Result, setQ2Result] = useState(null)

  // Estados Pergunta 3
  const [q3Casas, setQ3Casas] = useState('')
  const [q3Result, setQ3Result] = useState(null)

  // Estados Pergunta 4
  const [q4DataAdm, setQ4DataAdm] = useState('')
  const [q4DataDem, setQ4DataDem] = useState('')
  const [q4Salario, setQ4Salario] = useState('')
  const [q4Result, setQ4Result] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Estados para Histórico
  const [historico, setHistorico] = useState([])
  const [historicoAtual, setHistoricoAtual] = useState(1) // Qual pergunta está vendo histórico
  
  // Carregar histórico do sessionStorage ao montar o componente
  useEffect(() => {
    const historicoQ1 = JSON.parse(sessionStorage.getItem('hist_q1') || '[]')
    const historicoQ2 = JSON.parse(sessionStorage.getItem('hist_q2') || '[]')
    const historicoQ3 = JSON.parse(sessionStorage.getItem('hist_q3') || '[]')
    const historicoQ4 = JSON.parse(sessionStorage.getItem('hist_q4') || '[]')
  }, [])
  
  // Função para salvar resultado no sessionStorage
  const salvarNoHistorico = (pergunta, dados) => {
    const key = `hist_q${pergunta}`
    const historico = JSON.parse(sessionStorage.getItem(key) || '[]')
    historico.unshift({ ...dados, criado_em: new Date().toLocaleString('pt-BR') })
    if (historico.length > 10) historico.pop() // Manter apenas últimos 10
    sessionStorage.setItem(key, JSON.stringify(historico))
  }
  
  // Função para carregar histórico
  const carregarHistorico = (pergunta) => {
    const key = `hist_q${pergunta}`
    const data = JSON.parse(sessionStorage.getItem(key) || '[]')
    setHistorico(data)
    setHistoricoAtual(pergunta)
    setActiveTab(5)
  }
  
  // Função para limpar histórico
  const limparHistorico = (pergunta) => {
    const key = `hist_q${pergunta}`
    sessionStorage.removeItem(key)
    setHistorico([])
  }

  const handleQ1 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_URL}/q1-string`, { texto: q1Text })
      setQ1Result(res.data)
      salvarNoHistorico(1, res.data)
      setTimeout(() => setQ1Text(''), 400)
    } catch (err) {
      setError("Erro ao se comunicar com o backend")
    } finally {
      setLoading(false)
    }
  }

  const handleQ2 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_URL}/q2-sequencia`, { posicao: parseInt(q2Pos) })
      setQ2Result(res.data)
      salvarNoHistorico(2, res.data)
      setTimeout(() => setQ2Pos(''), 400)
    } catch (err) {
      setError(err.response?.data?.detail || "Erro de validação")
    } finally {
      setLoading(false)
    }
  }

  const handleQ3 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_URL}/q3-tabuleiro`, { casas: parseInt(q3Casas) })
      setQ3Result(res.data)
      salvarNoHistorico(3, res.data)
      setTimeout(() => setQ3Casas(''), 400)
    } catch (err) {
      setError("Mínimo de casas é 3")
    } finally {
      setLoading(false)
    }
  }

  const handleQ4 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_URL}/q4-rescisao`, {
        data_admissao: q4DataAdm,
        data_demissao: q4DataDem,
        salario: parseFloat(q4Salario)
      })
      setQ4Result(res.data)
      salvarNoHistorico(4, res.data)
      setTimeout(() => {
        setQ4DataAdm('')
        setQ4DataDem('')
        setQ4Salario('')
      }, 400)
    } catch (err) {
      setError("Verifique as datas inseridas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 shadow-md backdrop-blur sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-5xl mx-auto py-4 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MonitorPlay className="h-9 w-9 text-blue-600 drop-shadow" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              3S Checkout <span className="font-light text-gray-500">| Teste Sênior</span>
            </h1>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded shadow-sm">
            React + FastAPI + SessionStorage
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full flex justify-center items-start py-10 px-2">
        <div className="flex w-full max-w-5xl gap-8">
          {/* Sidebar com Abas */}
          <aside className="w-64 min-w-[200px] bg-white/80 border border-gray-100 rounded-2xl shadow-lg p-6 flex flex-col gap-2 sticky top-24 self-start">
            <nav className="flex flex-col gap-2">
              {[
                { id: 1, name: 'Pergunta 1 - Strings', icon: <TerminalSquare size={22} /> },
                { id: 2, name: 'Pergunta 2 - Sequências', icon: <Binary size={22} /> },
                { id: 3, name: 'Pergunta 3 - Tabuleiro', icon: <Calculator size={22} /> },
                { id: 4, name: 'Pergunta 4 - Rescisão', icon: <BriefcaseBusiness size={22} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setError(null) }}
                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 shadow-sm border border-transparent
                    ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-blue-200 scale-105 shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </nav>            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={() => { setActiveTab(5); setError(null) }}
              className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 shadow-sm border border-transparent
                ${activeTab === 5
                  ? 'bg-purple-50 text-purple-700 border-purple-200 scale-105 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              📊 Histórico
            </button>          </aside>

          {/* Card principal */}
          <section className="flex-1 bg-white/90 shadow-2xl border border-gray-100 rounded-2xl p-8 min-h-[480px] animate-fade-in-slow">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded rounded-lg relative">
                <strong>Atenção:</strong> {error}
              </div>
            )}

            {/* PERGUNTA 1 */}
            {activeTab === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Validação de Strings</h2>
                  <p className="text-gray-600">
                    Escreva uma função que determina se uma string termina com ‘A’ e começa com 'B'.
                  </p>
                </div>
                <form onSubmit={handleQ1} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Digite o texto</label>
                    <input
                      type="text"
                      required
                      value={q1Text}
                      onChange={e => setQ1Text(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: BANANA"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto px-6 py-2 rounded-md font-semibold transition-all duration-300
                      ${loading ? 'bg-blue-400 cursor-not-allowed scale-95 text-white' : 'bg-blue-600 hover:bg-blue-700 scale-100 text-white'}
                      shadow-md active:scale-90 focus:ring-2 focus:ring-blue-400 focus:outline-none flex items-center justify-center gap-2`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Verificando...
                      </>
                    ) : 'Verificar'}
                  </button>
                </form>
                {/* Após exibir o resultado, limpar o input */}
                {q1Result && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg flex items-center gap-3 animate-fade-in-slow">
                    <span className={`px-3 py-1 rounded text-sm font-bold ${q1Result.valido ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {q1Result.valido ? 'VÁLIDO' : 'INVÁLIDO'}
                    </span>
                    <span className="text-gray-700">A string analisada foi: <strong>"{q1Result.texto}"</strong></span>
                  </div>
                )}
                <button onClick={() => carregarHistorico(1)} className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  📋 Ver histórico desta pergunta
                </button>
              </div>
            )}

            {/* PERGUNTA 2 */}
            {activeTab === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Progressão Numérica</h2>
                  <p className="text-gray-600">
                    Considerando a sequência (11, 18, 25, 32, 39... ) informe a posição (X) para prever o número que ali estará.
                  </p>
                </div>
                <form onSubmit={handleQ2} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Posição desejada (N)</label>
                    <input
                      type="number"
                      required min="1"
                      value={q2Pos}
                      onChange={e => setQ2Pos(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 254"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    {loading ? 'Calculando...' : 'Calcular Posição'}
                  </button>
                </form>
                {q2Result && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-900">Resultado Encontrado:</h3>
                    <p className="text-blue-800 mt-2 text-2xl font-bold">
                      {Number(q2Result.valor).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">Para a posição {q2Result.posicao}</p>
                  </div>
                )}
                <button onClick={() => carregarHistorico(2)} className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  📋 Ver histórico desta pergunta
                </button>
              </div>
            )}

            {/* PERGUNTA 3 */}
            {activeTab === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Simulador de Tabuleiro</h2>
                  <p className="text-gray-600">
                    Insira o tamanho do tabuleiro de roleta (1 a 3 casas) para calcular o caminho perfeito e probabilidade.
                  </p>
                </div>
                <form onSubmit={handleQ3} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tamanho do tabuleiro (mín. 3)</label>
                    <input
                      type="number"
                      required min="3"
                      value={q3Casas}
                      onChange={e => setQ3Casas(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 5"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    {loading ? 'Simulando...' : 'Rodar Simulação'}
                  </button>
                </form>
                {q3Result && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <span className="text-sm text-green-700 font-medium">Turnos Mínimos</span>
                      <p className="text-2xl font-bold text-green-900 mt-1">{q3Result.turnos_minimos}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <span className="text-sm text-purple-700 font-medium">Probabilidade Perfeita</span>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {(q3Result.probabilidade_caminho_otimo * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <span className="text-sm text-amber-700 font-medium">Combinações Válidas</span>
                      <p className="text-2xl font-bold text-amber-900 mt-1">{q3Result.combinacoes_sem_looping}</p>
                    </div>
                  </div>
                )}
                <button onClick={() => carregarHistorico(3)} className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  📋 Ver histórico desta pergunta
                </button>
              </div>
            )}

            {/* PERGUNTA 4 */}
            {activeTab === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Acerto Rescisório (Férias e 13º)</h2>
                  <p className="text-gray-600">
                    Calcula férias (zera aniversário) e 13º (zera ano novo) após demissão.
                  </p>
                </div>
                <form onSubmit={handleQ4} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data Admissão</label>
                      <input
                        type="date"
                        required
                        value={q4DataAdm}
                        onChange={e => setQ4DataAdm(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data Demissão</label>
                      <input
                        type="date"
                        required
                        value={q4DataDem}
                        onChange={e => setQ4DataDem(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Último Salário (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={q4Salario}
                      onChange={e => setQ4Salario(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 12000.00"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    {loading ? 'Calculando...' : 'Calcular Direitos'}
                  </button>
                </form>
                {q4Result && (
                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h3 className="font-semibold text-gray-900 border-b pb-2 mb-3">Extrato Rescisório</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Décimo Terceiro (Proporcional):</span>
                        <span className="font-medium">R$ {q4Result.decimo_terceiro_proporcional.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Férias + 1/3 (Proporcionais):</span>
                        <span className="font-medium">R$ {q4Result.ferias_proporcionais_com_terco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-3 border-t font-semibold text-lg">
                        <span className="text-gray-900">Total a Receber:</span>
                        <span className="text-green-600">R$ {q4Result.total_receber.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={() => carregarHistorico(4)} className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  📋 Ver histórico desta pergunta
                </button>
              </div>
            )}

            {/* HISTÓRICO */}
            {activeTab === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-semibold mb-2">📊 Histórico de Cálculos</h2>
                  <p className="text-gray-600">
                    Todos os cálculos são salvos localmente no seu navegador via SessionStorage.
                  </p>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <button onClick={() => carregarHistorico(1)} className={`px-4 py-2 rounded-md text-sm font-medium transition ${historicoAtual === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    Q1
                  </button>
                  <button onClick={() => carregarHistorico(2)} className={`px-4 py-2 rounded-md text-sm font-medium transition ${historicoAtual === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    Q2
                  </button>
                  <button onClick={() => carregarHistorico(3)} className={`px-4 py-2 rounded-md text-sm font-medium transition ${historicoAtual === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    Q3
                  </button>
                  <button onClick={() => carregarHistorico(4)} className={`px-4 py-2 rounded-md text-sm font-medium transition ${historicoAtual === 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    Q4
                  </button>
                  <button onClick={() => { limparHistorico(historicoAtual); setHistorico([]) }} className="ml-auto px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2">
                    <Trash2 size={18} />
                    Limpar
                  </button>
                </div>
                
                {historico.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {historico.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm hover:bg-blue-50 transition">
                        <p className="text-xs text-gray-500 font-medium mb-2">{item.criado_em}</p>
                        <pre className="text-xs text-gray-700 overflow-auto bg-white p-3 rounded border">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Nenhum histórico encontrado para a Pergunta {historicoAtual}.</p>
                    <p className="text-sm mt-2">Realize alguns cálculos primeiro!</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
