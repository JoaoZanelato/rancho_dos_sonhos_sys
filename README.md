# Rancho dos Sonhos - Sistema de Gestão

## Descrição do Projeto
Sistema web desenvolvido à medida para gerir a carteira de clientes (famílias) e o fluxo de caixa do estúdio fotográfico Rancho dos Sonhos. A aplicação centraliza o registo de membros familiares, histórico de pagamentos e fornece um painel financeiro analítico para acompanhamento de métricas de faturação.

## Arquitetura
O projeto segue uma arquitetura separada em dois serviços principais:
* **Frontend (Client-side):** Interface de utilizador a consumir uma API REST.
* **Backend (Server-side):** API RESTful responsável pela regra de negócio, segurança e comunicação com a base de dados.

## Escolhas Tecnológicas

### Frontend
* **React + Vite:** Escolhido pela alta velocidade de carregamento (HMR) durante o desenvolvimento e por gerar um build estático altamente otimizado para produção.
* **Tailwind CSS:** Utilizado para padronização da interface. Permite criar componentes responsivos rapidamente e mantém o código limpo, sem a necessidade de manter dezenas de ficheiros CSS externos.
* **React Router DOM:** Gere a navegação no lado do cliente (Single Page Application), garantindo transições de ecrã sem recarregar a página.
* **Lucide React:** Biblioteca de ícones leve e consistente.

### Backend
* **Node.js + Express:** Framework minimalista e escalável, ideal para construir APIs REST de forma rápida e com processamento assíncrono eficiente.
* **Prisma ORM:** Escolhido para fazer a ponte entre o código e a base de dados. Garante tipagem segura, previne erros de SQL Injection e facilita a criação de migrações estruturais.
* **PostgreSQL (Supabase):** Base de dados relacional. Escolhido pela sua integridade referencial, garantindo que dependências (como os pagamentos de uma família) sejam tratadas corretamente.
* **JSON Web Token (JWT):** Implementado para a autenticação. É uma abordagem *stateless* (não guarda sessão no servidor), o que torna a aplicação mais leve e segura contra acessos não autorizados nas rotas da API.

### Infraestrutura
* **Vercel:** Plataforma de hospedagem escolhida para ambos os serviços. O Frontend corre como aplicação estática e o Backend utiliza *Serverless Functions*, reduzindo custos e facilitando o deploy contínuo.

## Estrutura e Funcionalidades

### 1. Módulo de Autenticação (`authRoutes.js` / `Login.jsx`)
Garante que apenas utilizadores autorizados acedam ao sistema. Valida credenciais armazenadas no servidor e emite um token JWT válido por 7 dias, que é exigido em todos os pedidos subsequentes.

### 2. Painel de Controlo (`Dashboard.jsx`)
Processa os dados da base de dados para entregar métricas financeiras em tempo real. Calcula:
* Faturação do mês atual.
* Faturação histórica total.
* Ticket médio por família.
* Tabela de fluxo de caixa com os últimos registos de entrada.

### 3. Gestão de Clientes (`familyController.js` / `Clients.jsx` / `ClientForm.jsx`)
Realiza as operações de CRUD (Create, Read, Update, Delete) das famílias. 
* Permite registar a família e múltiplos membros simultaneamente, definindo papéis (Pai, Mãe, Bebé, etc.).
* O backend garante que, ao excluir uma família, todos os membros e histórico de pagamentos vinculados sejam apagados em cascata, evitando dados órfãos na base de dados.

### 4. Controles Financeiro (`Incomes.jsx`)
Módulo para o registo de entradas de caixa. Vincula obrigatoriamente um valor financeiro e uma descrição a uma família existente, alimentando o histórico individual do cliente e os cálculos do Dashboard.

