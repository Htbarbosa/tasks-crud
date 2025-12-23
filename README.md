# Tasks CRUD API

API REST para gerenciamento de tarefas desenvolvida em **Node.js** e **TypeScript**, utilizando apenas o módulo HTTP nativo (sem Express ou outros frameworks).

## Arquitetura

O projeto segue os princípios de **DDD (Domain-Driven Design)** e **Clean Code**, organizado em camadas:

```
src/
├── domain/           # Entidades, Value Objects, Interfaces de Repository
├── application/      # Use Cases, DTOs
├── infrastructure/   # Implementações de Repository, Database, Services
├── presentation/     # HTTP Server, Router, Controllers, Validators
├── shared/           # Erros, Utilitários compartilhados
└── main.ts           # Entry point com injeção de dependências
```

## Requisitos

- Node.js >= 22.0.0 (LTS)
- npm ou yarn

## Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

## Variáveis de Ambiente

| Variável       | Descrição                                   | Padrão   |
| -------------- | ------------------------------------------- | -------- |
| `PORT`         | Porta do servidor HTTP                      | `3000`   |
| `STORAGE_TYPE` | Tipo de persistência (`memory` ou `sqlite`) | `sqlite` |

## Endpoints da API

### Listar Tarefas

```http
GET /tasks
GET /tasks?title=typescript
GET /tasks?description=api
GET /tasks?title=learn&description=patterns
```

### Obter Tarefa por ID

```http
GET /tasks/:id
```

### Criar Tarefa

```http
POST /tasks
Content-Type: application/json

{
  "title": "Minha tarefa",
  "description": "Descrição da tarefa"
}
```

### Atualizar Tarefa

```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Título atualizado",
  "description": "Descrição atualizada"
}
```

### Deletar Tarefa

```http
DELETE /tasks/:id
```

### Marcar como Concluída

```http
PATCH /tasks/:id/complete
```

### Importar Tarefas via CSV

```http
POST /tasks/import
Content-Type: multipart/form-data

file: tasks.csv
```

## Formato do Arquivo CSV

O arquivo CSV deve conter as colunas `title`, `description` e `completed`:

```csv
title,description,completed
Learn TypeScript,Study advanced TypeScript patterns,false
Build REST API,Create a CRUD API without frameworks,true
```

## Exemplos com cURL

```bash
# Criar tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Nova tarefa", "description": "Descrição"}'

# Listar todas
curl http://localhost:3000/tasks

# Filtrar por título
curl "http://localhost:3000/tasks?title=typescript"

# Obter por ID
curl http://localhost:3000/tasks/UUID-AQUI

# Atualizar
curl -X PUT http://localhost:3000/tasks/UUID-AQUI \
  -H "Content-Type: application/json" \
  -d '{"title": "Atualizada", "description": "Nova descrição"}'

# Marcar como concluída
curl -X PATCH http://localhost:3000/tasks/UUID-AQUI/complete

# Deletar
curl -X DELETE http://localhost:3000/tasks/UUID-AQUI

# Importar CSV
curl -X POST http://localhost:3000/tasks/import \
  -F "file=@sample-tasks.csv"
```

## Estrutura de Resposta

### Sucesso

```json
{
  "error": false,
  "message": "Success",
  "data": { ... }
}
```

### Erro

```json
{
  "error": true,
  "message": "Error description",
  "statusCode": 400
}
```

## Tecnologias

- **Node.js** (HTTP nativo)
- **TypeScript** 5.7+
- **better-sqlite3** - Banco de dados SQLite
- **csv-parse** - Parser de CSV
- **busboy** - Parser de multipart/form-data

## Licença

MIT
