# Estrutura Lógica do Aplicativo Conexão Saudável

## 1. Arquitetura de Dados

### 1.1 Estrutura do Banco de Dados

```sql

-- Usuários

CREATE TABLE sers (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Perfis de Usuário

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    preferences JSONB,
    notification_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registros Emocionais

CREATE TABLE emotional_entries (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    mood_evel INTEGER NOT NULL,
    intensity INTEGER NOT NULL,
    triggers TEXT[],
    coping_strategies TEXT[],
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recursos de Apoio

CREATE TABLE support_resources (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    descrip
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50)[],
    content TEXT,
    duration INTEGER,
    difficulty INTEGER,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progresso do Usuário

CREATE TABLE user_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    emotional_streak INTEGER DEFAULT 0,
    completed_exercises UUID[],
    achieved_goals UUID[],
    current_mood INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

```

### 1.2 Interfaces TypeScript

```typescript

// Interfaces Base

interface BaseEntity {
    id: sting;
    createdAt: Date;
    updatedAt: Date;

}

  

// Usuário

interface User extends BaseEntity {
    email: string;
    name: string;
    role: UserRole;
    profile?: UserProfile;
}

  

// Perfil do Usuário

interface UserProfile extends BaseEntity {
    userId: string;
    preferences: UserPreferences;
    notificationSettings: NotificationSettings;
}

// Registro Emocional

interface EmotionalEntry extends BaseEntity {
    userId: string;
    moodLevel: number;
    intensity: number;
    triggers: string[];
    copingStrategies: string[];
    notes: string;
    tags: string[];
}


// Recurso de Apoio

interface SupportResource extends BaseEntity {

    title: string;
    description: string;
    type: ResourceType;
    category: string[];
    content: string;
    duration: number;
    difficulty: number;
    tags: string[];
}

  

// Progresso do Usuário

interface UserProgress extends BaseEntity {

    userId: string;
    emotionalStreak: number;
    completedExercises: string[];
    achievedGoals: string[];
    currentMood: number;

}

```

  

## 2. API RESTful

  

### 2.1 Rotas de Autenticação

```typescript

// Autenticação

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password

```

### 2.2 Rotas de Usuário
```typescript

// Gerenciamento de Usuário

GET /api/users/me
PUT /api/users/me
GET /api/users/me/profile
PUT /api/users/me/profile
GET /api/users/me/preferences
PUT /api/users/me/preferences

```

### 2.3 Rotas de Diário Emocional
```typescript

// Registros Emocionais

POST /api/emotional-entries
GET /api/emotional-entries
GET /api/emotional-entries/:id
PUT /api/emotional-entries/:id
DELETE /api/emotional-entries/:id
GET /api/emotional-entries/stats
GET /api/emotional-entries/patterns

```

### 2.4 Rotas de Recursos

```typescript

// Recursos de Apoio

GET /api/resources
GET /api/resources/:id
POST /api/resources
PUT /api/resources/:id
DELETE /api/resources/:id
GET /api/resources/categories
GET /api/resources/recommended

```

### 2.5 Rotas de Progresso

```typescript

// Progresso do Usuário

GET /api/progress

GET /api/progress/stats

GET /api/progress/goals

POST /api/progress/goals

PUT /api/progress/goals/:id

DELETE /api/progress/goals/:id

```

  

## 3. Serviços e Lógica de Negócio

  

### 3.1 Serviços de Autenticação

```typescript

class AuthService {

    async register(userData: RegisterDTO): Promise<User>;

    async login(credentials: LoginDTO): Promise<AuthResponse>;

    async refreshToken(token: string): Promise<AuthResponse>;

    async forgotPassword(email: string): Promise<void>;

    async resetPassword(token: string, newPassword: string): Promise<void>;

}

```

  

### 3.2 Serviços de Diário Emocional

```typescript

class EmotionalEntryService {

    async createEntry(entry: CreateEntryDTO): Promise<EmotionalEntry>;

    async getEntries(filters: EntryFilters): Promise<EmotionalEntry[]>;

    async getEntryStats(userId: string): Promise<EntryStats>;

    async analyzePatterns(userId: string): Promise<EmotionalPatterns>;

}

```

  

### 3.3 Serviços de Recursos

```typescript

class ResourceService {

    async getResources(filters: ResourceFilters): Promise<SupportResource[]>;

    async getRecommendedResources(userId: string): Promise<SupportResource[]>;

    async trackResourceUsage(userId: string, resourceId: string): Promise<void>;

    async getResourceCategories(): Promise<Category[]>;

}

```

  

### 3.4 Serviços de Progresso

```typescript

class ProgressService {

    async getProgress(userId: string): Promise<UserProgress>;

    async updateProgress(userId: string, data: ProgressUpdateDTO): Promise<UserProgress>;

    async getGoals(userId: string): Promise<Goal[]>;

    async createGoal(userId: string, goal: CreateGoalDTO): Promise<Goal>;

}

```

  

## 4. Middleware e Interceptores

  

### 4.1 Autenticação

```typescript

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    // Verificação de token

    // Validação de permissões

    // Logging de acesso

};

```

  

### 4.2 Validação

```typescript

const validationMiddleware = (schema: Schema) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        // Validação de dados

        // Sanitização

        // Tratamento de erros

    };

};

```

  

### 4.3 Cache

```typescript

const cacheMiddleware = (duration: number) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        // Verificação de cache

        // Armazenamento em cache

        // Invalidação de cache

    };

};

```

  

## 5. Estratégias de Cache

  

### 5.1 Cache em Memória

- Redis para dados frequentemente acessados

- Cache de sessão

- Cache de recursos estáticos

  

### 5.2 Cache no Cliente

- LocalStorage para dados do usuário

- IndexedDB para dados offline

- Service Workers para recursos estáticos

  

## 6. Tratamento de Erros

  

### 6.1 Códigos de Erro

```typescript

enum ErrorCodes {

    UNAUTHORIZED = 401,

    FORBIDDEN = 403,

    NOT_FOUND = 404,

    VALIDATION_ERROR = 422,

    INTERNAL_ERROR = 500

}

```

  

### 6.2 Estrutura de Erro

```typescript

interface ApiError {

    code: ErrorCodes;

    message: string;

    details?: any;

    timestamp: Date;

}

```

  

## 7. Logging e Monitoramento

  

### 7.1 Estrutura de Logs

```typescript

interface LogEntry {

    level: 'info' | 'warn' | 'error';

    message: string;

    context: any;

    timestamp: Date;

    userId?: string;

}

```

  

### 7.2 Métricas

- Tempo de resposta

- Taxa de erro

- Uso de recursos

- Métricas de negócio