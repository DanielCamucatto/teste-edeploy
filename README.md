# 3S Checkout - Teste Técnico | Desenvolvedor Full Stack Sênior

## 📌 Sobre o Projeto
Este repositório contém a resolução do teste técnico para a vaga de **Desenvolvedor Full Stack Sênior (Python + React)** na **3S Checkout**. 

Para oferecer uma melhor experiência de avaliação e demonstrar proficiência prática no stack exigido, as respostas lógicas foram integradas em uma **aplicação Full Stack interativa**, permitindo testes dinâmicos das funções em tempo real.

---

## 🛠️ Especificações Técnicas

Esta aplicação segue uma arquitetura moderna, com separação de responsabilidades (Frontend desacoplado do Backend), visando escalabilidade e manutenibilidade.

### Backend (Python)
- **Framework:** FastAPI (escolhido pela alta peformance e geração automática de documentação Swagger/OpenAPI).
- **Linguagem:** Python 3.10+
- **Validação e Tipagem:** Pydantic
- **Testes Automatizados:** `pytest` (Cobrindo as regras de negócio das 4 perguntas)
- **Deploy:** Render / Koyeb (ou Vercel Serverless Functions)

### Frontend (React)
- **Framework:** React com Vite (maior velocidade no ambiente de desenvolvimento).
- **Estilização:** Tailwind CSS (para uma interface responsiva, limpa e moderna).
- **Integração:** Axios (para consumo da API RESTful).
- **Deploy:** Vercel ou Netlify.

---

## 📝 Planejamento da Demanda (Roadmap)

A construção do projeto foi estruturada em três fases principais para garantir entregas incrementais e qualidade de código:

### Fase 1: Backend (Lógica de Negócio e API)
- [ ] **Setup do Projeto Python:** Inicialização do ambiente virtual (`venv`) e `requirements.txt`.
- [ ] **Resolução Algorítmica:**
  - [ ] Pergunta 1: Validação de strings (inicia com 'B' e termina com 'A').
  - [ ] Pergunta 2: Progressão Aritmética (PA) posicional.
  - [ ] Pergunta 3: Simulador probabilístico/caminho ótimo para o jogo de tabuleiro.
  - [ ] Pergunta 4: Cálculo de acerto rescisório (Férias e 13º salário).
- [ ] **Construção da API REST:** Expor as funções através de rotas do FastAPI (métodos POST/GET).
- [ ] **Qualidade e Testes:** Escrita de testes unitários com `pytest`.
- [ ] **Pipeline e Deploy:** Configuração para hospedagem do backend.

### Fase 2: Frontend (Interface Interativa)
- [ ] **Setup do Projeto React:** Criação do boilerplate com Vite + Tailwind.
- [ ] **UX/UI Design:** Estruturação visual com abas/cards para cada uma das 4 perguntas.
- [ ] **Desenvolvimento de Componentes:** Formulários de input dinâmicos para testar os cenários.
- [ ] **Integração:** Conexão com os endpoints do backend.
- [ ] **Tratamento de Estado:** Feedbacks de loading, sucesso e erro para o usuário.
- [ ] **Deploy:** Hospedagem na plataforma da Vercel/Netlify.

### Fase 3: Documentação e Entrega
- [ ] Revisão de código e refatoração.
- [ ] Atualização final deste README com guias de execução e links de produção.
- [ ] Envio para avaliação do RH/Gestor.

---

## 🚀 Como Executar o Projeto Localmente

*(Instruções detalhadas serão adicionadas após a finalização da Fase 1 e 2)*

### Pré-requisitos
- Python 3.10+
- Node.js 18+

### Rodando a API
```bash
# Instruções em breve
```

### Rodando o Frontend
```bash
# Instruções em breve
```
