# Conexão Saudável

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Conexao-Saudavel/app-conexao-saudavel)

Aplicativo mobile voltado ao controle da dependência digital entre estudantes universitários. A aplicação contará com um app que será usado pelo usuário final para ajuda-lo no dia-a-dia com a redução do seu tempo de tela e permitirá que o usuário tenha uma forma de acompanhar suas melhorias. 
O app contará com um banco local para armazenar os dados localmente quando offline e assim que possível realizar a sincronização dos dados com o servidor remoto para que a instituição que controla o uso do app pelo usuário final possa ter acesso aos dados e assim tomar decisões a respeito do acompanhamento do usuário.

## Diagrama de Contexto

```mermaid
flowchart TD
    subgraph "Cliente (Mobile)"
        UI[Interface do Usuário] --> StateManager[Gerenciador de Estado]
        StateManager --> ApiClient[Cliente API]
        StateManager --> LocalStorage[(SQLite)]
        
        subgraph "Serviços Nativos"
            BgService[Serviço Background] --> UsageMonitor[Monitor de Uso]
            BgService --> NotificationService[Serviço de Notificações]
            UsageMonitor --> LocalStorage
        end
        
        SyncManager[Gerenciador de Sincronização] --> LocalStorage
        SyncManager --> ApiClient
        SyncManager -.-> BgService
    end
    
    subgraph "Servidor"
        ApiGateway[API Gateway] --> AuthService[Serviço de Autenticação]
        ApiGateway --> SyncService[Serviço de Sincronização]
        ApiGateway --> AnalyticsService[Serviço de Analytics]
        ApiGateway --> ReportService[Serviço de Relatórios]
        
        SyncService --> DataProcessor[Processador de Dados]
        DataProcessor --> DbService[Serviço de Banco de Dados]
        AnalyticsService --> DbService
        ReportService --> DbService
        
        DbService --> Database[(PostgreSQL)]
        
        subgraph "Frontend Web"
            WebUi[Interface Web] --> WebApiClient[Cliente API Web]
            WebApiClient --> ApiGateway
        end
    end
    
    ApiClient <--> ApiGateway
    
    classDef mobile fill:#e6f3ff,stroke:#6cb2eb,stroke-width:2px
    classDef backend fill:#f0fff4,stroke:#4fd1c5,stroke-width:2px
    classDef database fill:#f7fafc,stroke:#a0aec0,stroke-width:2px
    classDef web fill:#fef3f2,stroke:#f56565,stroke-width:2px
    
    class UI,StateManager,ApiClient,LocalStorage,BgService,UsageMonitor,NotificationService,SyncManager mobile
    class ApiGateway,AuthService,SyncService,AnalyticsService,ReportService,DataProcessor,DbService backend
    class Database,LocalStorage database
    class WebUi,WebApiClient web
```

## Diagrama do fluxo de dados

```mermaid
sequenceDiagram
    participant U as Usuário
    participant App as App Mobile
    participant BGS as Serviço Background
    participant DB as SQLite Local
    participant API as Backend API
    participant PG as PostgreSQL
    participant Web as Portal Web
    
    Note over U,App: Fluxo de Monitoramento
    BGS->>BGS: Monitoramento contínuo de uso
    BGS->>DB: Registro de eventos de uso
    
    Note over U,App: Interação do Usuário
    U->>App: Abre aplicativo
    App->>DB: Carrega dados locais
    DB->>App: Retorna estatísticas
    App->>U: Exibe dashboard
    
    Note over App,PG: Sincronização Periódica
    App->>App: Verifica conectividade
    App->>DB: Busca eventos não sincronizados
    DB->>App: Retorna lote de eventos
    App->>API: POST /sync/events com payload
    API->>API: Valida eventos
    API->>PG: Persiste eventos válidos
    PG->>API: Confirmação
    API->>API: Gera atualizações para cliente
    API->>App: Resposta: eventos processados + atualizações
    App->>DB: Marca eventos como sincronizados
    App->>DB: Aplica atualizações (config, limites)
    
    Note over U,App: Notificações e Alertas
    BGS->>BGS: Detecta limite excedido
    BGS->>App: Notifica sobre uso excessivo
    App->>U: Exibe notificação
    
    Note over U,Web: Portal Institucional
    Web->>API: GET /analytics/institution/{id}
    API->>PG: Consulta agregada
    PG->>API: Retorna dados analíticos
    API->>Web: Envia métricas
    Web->>Web: Renderiza dashboard
    
    Note over App,API: Geração de Relatório
    U->>App: Solicita relatório PDF
    App->>API: GET /reports/user/{id}
    API->>PG: Consulta dados completos
    PG->>API: Retorna dados para relatório
    API->>API: Gera PDF com gráficos
    API->>App: Retorna arquivo PDF
    App->>U: Exibe/compartilha relatório
```


## Diagrama do processo de sincronização detalhado

```mermaid
flowchart TD
    Start([Início do Processo de Sincronização]) --> CheckConnection{Conexão disponível?}
    CheckConnection -- Não --> ScheduleRetry[Agendar nova tentativa]
    CheckConnection -- Sim --> CheckLock{Sync em progresso?}
    
    CheckLock -- Sim --> End([Fim: Já em andamento])
    CheckLock -- Não --> SetLock[Ativar lock de sincronização]
    
    SetLock --> FetchPending[Buscar eventos pendentes]
    FetchPending --> CheckCount{Eventos > 0?}
    
    CheckCount -- Não --> ResetLock[Liberar lock]
    ResetLock --> End
    
    CheckCount -- Sim --> PreparePayload[Preparar payload]
    PreparePayload --> SendToServer[Enviar para servidor]
    
    SendToServer --> ServerValidation{Validação no servidor}
    ServerValidation -- Falha --> LogError[Registrar erro]
    ServerValidation -- Sucesso --> ProcessEvents[Processar eventos]
    
    ProcessEvents --> GenerateResponse[Gerar resposta]
    GenerateResponse --> SendResponse[Enviar resposta]
    
    SendResponse --> ClientUpdate[Cliente: Atualizar BD local]
    ClientUpdate --> ApplyUpdates[Aplicar atualizações do servidor]
    
    LogError --> RetryStrategy{Política de retry?}
    RetryStrategy -- Backoff --> ScheduleBackoff[Agendar com backoff]
    RetryStrategy -- Desistir --> MarkFailed[Marcar eventos como falha]
    
    ApplyUpdates --> ResetLock2[Liberar lock]
    ScheduleBackoff --> ResetLock2
    MarkFailed --> ResetLock2
    
    ResetLock2 --> End2([Fim do processo])
```

## 

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- SQLite
- React Native
- Jest
- ESLint
- Prettier
- Winston (Logging)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Conexao-Saudavel/app-conexao-saudavel.git
cd conexao-saudavel
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Execute as migrações do banco de dados:
```bash
npm run migration:run
```

## 🚀 Executando o projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🧪 Testes

```bash
# Executa todos os testes
npm test

# Executa os testes com cobertura
npm test -- --coverage
```

## 📦 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run build`: Compila o projeto
- `npm start`: Inicia o servidor em modo produção
- `npm test`: Executa os testes
- `npm run lint`: Verifica o código com ESLint
- `npm run lint:fix`: Corrige problemas de linting
- `npm run format`: Formata o código com Prettier
- `npm run migration:generate`: Gera uma nova migração
- `npm run migration:run`: Executa as migrações pendentes
- `npm run migration:revert`: Reverte a última migração

## 📁 Estrutura do Projeto

```
├──docs...
├──mobile
│   ├──src
│   │   ├──components
│   │   │   ├──auth
│   │   │   │   ├──RegistrationForm.tsx
│   │   │   │   └──TermsCheckbox.tsx
│   │   │   ├──common
│   │   │   │   ├──Button.tsx
│   │   │   │   ├──InputField.tsx
│   │   │   │   ├──ScreenWrapper.tsx
│   │   │   │   └──Typography.tsx
│   │   │   ├──forms
│   │   │   │   └──.gitkeep
│   │   │   └──layout
│   │   │   │   └──.gitkeep
│   │   ├──error
│   │   │   ├──components
│   │   │   │   └──.gitkeep
│   │   │   ├──constants
│   │   │   │   ├──codes.ts
│   │   │   │   └──messages.ts
│   │   │   ├──handlers
│   │   │   │   ├──api
│   │   │   │   ├──storage
│   │   │   │   └──.gitkeep
│   │   │   ├──types
│   │   │   │   └──.gitkeep
│   │   │   └──utils
│   │   │   │   └──.gitkeep
│   │   ├──hooks
│   │   │   └──.gitkeep
│   │   ├──navigation
│   │   │   ├──AuthNavigator.tsx
│   │   │   └──MainNavigator.tsx
│   │   ├──screens
│   │   │   ├──Auth
│   │   │   │   └──RegisterScreen.tsx
│   │   │   ├──dashboard
│   │   │   │   └──.gitkeep
│   │   │   ├──profile
│   │   │   │   └──.gitkeep
│   │   │   └──settings
│   │   │   │   └──.gitkeep
│   │   ├──services
│   │   │   ├──api
│   │   │   │   ├──authService.ts
│   │   │   │   └──client.ts
│   │   │   ├──background
│   │   │   │   └──.gitkeep
│   │   │   └──storage
│   │   │   │   └──.gitkeep
│   │   ├──store
│   │   │   └──slices
│   │   │   │   └──.gitkeep
│   │   ├──theme
│   │   │   ├──paperTheme.ts
│   │   │   └──.gitkeep
│   │   ├──types
│   │   │   ├──auth.ts
│   │   │   └──common.ts
│   │   ├──utils
│   │   │   └──.gitkeep
│   │   └──App.tsx
│   ├──babel.config.js
│   ├──metro.config.js
│   ├──package.json
│   ├──tsconfig.json
│   ├──.eslintrc.js
│   └──.prettierrc
├──src
│   ├──@types
│   ├──api
│   │   ├──controllers
│   │   │   ├──auth
│   │   │   │   └──.gitkeep
│   │   │   ├──monitoring
│   │   │   │   └──.gitkeep
│   │   │   └──user
│   │   │   │   └──.gitkeep
│   │   ├──middlewares
│   │   │   ├──auth
│   │   │   │   └──.gitkeep
│   │   │   ├──error
│   │   │   │   └──.gitkeep
│   │   │   ├──validation
│   │   │   │   └──schemas
│   │   │   │   │   └──.gitkeep
│   │   │   └──logging.middleware.ts
│   │   ├──routes
│   │   │   └──.gitkeep
│   │   ├──services
│   │   │   ├──auth
│   │   │   │   └──.gitkeep
│   │   │   └──user
│   │   │   │   └──.gitkeep
│   │   └──validators
│   │   │   └──auth
│   ├──core
│   │   ├──config
│   │   │   └──.gitkeep
│   │   ├──errors
│   │   │   ├──base
│   │   │   │   └──.gitkeep
│   │   │   ├──handlers
│   │   │   │   └──.gitkeep
│   │   │   └──middleware
│   │   │   │   └──.gitkeep
│   │   └──types
│   │   │   └──.gitkeep
│   ├──database
│   │   ├──entities
│   │   │   ├──monitoring
│   │   │   │   ├──app_usage.entity.ts
│   │   │   │   └──daily_summary.entity.ts
│   │   │   ├──achievements.entity.ts
│   │   │   ├──institution.entity.ts
│   │   │   ├──PasswordResetToken.ts
│   │   │   ├──questionnaire_responses.entity.ts
│   │   │   ├──sync_log.entity.ts
│   │   │   ├──user_settings.entity.ts
│   │   │   └──user.entity.ts
│   │   ├──migrations
│   │   │   ├──1684872321000-CreateInitialTables.ts
│   │   │   └──.gitkeep
│   │   ├──report
│   │   │   └──entities
│   │   │   │   └──report.entity.ts
│   │   ├──repositories
│   │   │   ├──achievements.repository.ts
│   │   │   ├──app-usage.repository.ts
│   │   │   ├──daily-summary.repository.ts
│   │   │   ├──institution.repository.ts
│   │   │   ├──password-reset-token.repository.ts
│   │   │   ├──questionnaire-responses.repository.ts
│   │   │   ├──sync-log.repository.ts
│   │   │   ├──user-settings.repository.ts
│   │   │   └──user.repository.ts
│   │   ├──seeds
│   │   │   └──.gitkeep
│   │   └──data-source.ts
│   ├──tests
│   │   ├──e2e
│   │   │   └──scenarios
│   │   │   │   └──.gitkeep
│   │   ├──integration
│   │   │   ├──api
│   │   │   │   └──.gitkeep
│   │   │   └──database
│   │   │   │   └──.gitkeep
│   │   └──unit
│   │   │   ├──controllers
│   │   │   │   └──.gitkeep
│   │   │   ├──services
│   │   │   │   └──.gitkeep
│   │   │   └──utils
│   │   │   │   └──.gitkeep
│   ├──utils
│   │   ├──helpers
│   │   │   └──.gitkeep
│   │   ├──logger
│   │   │   ├──config.ts
│   │   │   ├──example.ts
│   │   │   ├──index.ts
│   │   │   └──.gitkeep
│   │   └──validators
│   │   │   └──.gitkeep
│   └──index.ts
├──.husky
│   └──_
│   │   ├──applypatch-msg
│   │   ├──commit-msg
│   │   ├──h
│   │   ├──husky.sh
│   │   ├──post-applypatch
│   │   ├──post-checkout
│   │   ├──post-commit
│   │   ├──post-merge
│   │   ├──post-rewrite
│   │   ├──pre-applypatch
│   │   ├──pre-auto-gc
│   │   ├──pre-commit
│   │   ├──pre-merge-commit
│   │   ├──pre-push
│   │   ├──pre-rebase
│   │   ├──prepare-commit-msg
│   │   └──.gitignore
├──docker-compose.yml
├──Dockerfile
├──jest.config.js
├──LICENSE
├──package-lock.json
├──package.json
├──README.md
├──tsconfig.json
├──.dockerignore
├──.eslintrc.json
├──.gitignore
└──.prettierrc

```

## 📝 Logging

O projeto utiliza Winston para gerenciamento de logs com as seguintes características:

### Níveis de Log
- error: Erros críticos
- warn: Avisos importantes
- info: Informações gerais
- http: Requisições HTTP
- debug: Informações de debug

### Destinos de Log
- Console (colorido)
- Arquivo de erros (`logs/error.log`)
- Arquivo de todos os logs (`logs/all.log`)

### Uso do Logger
```typescript
import { logError, logInfo, logWarning, logDebug, logHttp } from './utils/logger';

// Exemplo de uso
logInfo('Operação concluída', { userId: '123' });
logError(new Error('Erro de autenticação'), 'AuthService');
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

