# Feature: Autenticação

## Descrição
Implementação do sistema de autenticação para o aplicativo Conexão Saudável, permitindo que usuários (estudantes universitários) possam se registrar, fazer login e gerenciar suas credenciais de acesso.

## Objetivos
- Permitir que novos usuários se registrem no sistema
- Autenticar usuários existentes
- Gerenciar tokens de acesso
- Permitir recuperação de senha
- Implementar middleware de autenticação para proteção de rotas

## Requisitos Funcionais

### 1. Registro de Usuário (Signup)
- Endpoint: `POST /api/auth/signup`
- Campos necessários:
  - Nome completo
  - Email institucional (com validação de domínio universitário)
  - Senha (com requisitos mínimos de segurança)
  - Instituição de ensino
  - Curso
  - Matrícula
- Validações:
  - Email único no sistema
  - Senha com mínimo de 8 caracteres
  - Confirmação de senha
  - Validação de domínio de email institucional

### 2. Login (Signin)
- Endpoint: `POST /api/auth/signin`
- Campos necessários:
  - Email
  - Senha
- Retorno:
  - Token JWT
  - Dados básicos do usuário
  - Refresh token

### 3. Recuperação de Senha
- Endpoint: `POST /api/auth/forgot-password`
- Endpoint: `POST /api/auth/reset-password`
- Fluxo:
  1. Usuário solicita recuperação
  2. Sistema envia email com token único
  3. Usuário redefine senha com token

### 4. Middleware de Autenticação
- Verificação de token JWT
- Validação de refresh token
- Proteção de rotas autenticadas

## Requisitos Não Funcionais
- Segurança:
  - Senhas armazenadas com hash bcrypt
  - Tokens JWT com expiração
  - Rate limiting para tentativas de login
  - Proteção contra ataques de força bruta
- Performance:
  - Tempo de resposta < 200ms para autenticação
  - Cache de tokens válidos
- Disponibilidade:
  - Sistema de fallback para autenticação
  - Logs de tentativas de acesso

## Tecnologias
- JWT para tokens
- bcrypt para hash de senhas
- Redis para cache de tokens
- Nodemailer para envio de emails
- Winston para logging

## Estrutura de Arquivos
```
src/api/
├── controllers/
│   └── auth/
│       ├── signup.controller.ts
│       ├── signin.controller.ts
│       ├── forgot-password.controller.ts
│       └── reset-password.controller.ts
├── middlewares/
│   └── auth/
│       ├── auth.middleware.ts
│       └── validate-token.middleware.ts
├── services/
│   └── auth/
│       ├── auth.service.ts
│       └── token.service.ts
└── routes/
    └── auth.routes.ts
```

## Testes
- Testes unitários para:
  - Validação de dados
  - Geração de tokens
  - Hash de senhas
- Testes de integração para:
  - Fluxo completo de registro
  - Fluxo completo de login
  - Recuperação de senha
- Testes e2e para:
  - Cenários de uso real
  - Casos de erro

## Critérios de Aceitação
1. Usuário consegue se registrar com sucesso
2. Usuário consegue fazer login com credenciais válidas
3. Usuário não consegue acessar com credenciais inválidas
4. Usuário consegue recuperar senha
5. Rotas protegidas só são acessíveis com token válido
6. Sistema registra tentativas de acesso inválidas
7. Emails são enviados corretamente para recuperação de senha

## Próximos Passos
1. Configurar ambiente de desenvolvimento
2. Implementar estrutura base de autenticação
3. Desenvolver endpoints de registro e login
4. Implementar sistema de tokens
5. Desenvolver recuperação de senha
6. Implementar middleware de autenticação
7. Realizar testes e ajustes
8. Documentar APIs 