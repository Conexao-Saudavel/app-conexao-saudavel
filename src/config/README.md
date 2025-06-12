# Configurações da API

Este diretório contém as configurações centralizadas para comunicação com a API do servidor.

## Arquivo `api.ts`

### Configurações Principais

- **BASE_URL**: URL base do servidor Railway
  - Produção: `https://server-conexao-saudavel-production.up.railway.app`
  - Desenvolvimento: `http://10.0.2.2:3000` (para emulador Android)

### Endpoints Configurados

#### Autenticação
- `AUTH.LOGIN`: `/api/auth/login`
- `AUTH.REGISTER`: `/api/auth/register`
- `AUTH.LOGOUT`: `/api/auth/logout`

#### Sincronização
- `SYNC.USAGE_DATA`: `/api/sync/usage-data`
- `SYNC.EVENTS`: `/api/sync/events`

#### Usuário
- `USER.PROFILE`: `/api/user/profile`
- `USER.SETTINGS`: `/api/user/settings`

### Funções Utilitárias

- `buildApiUrl(endpoint)`: Constrói URLs completas
- `getBaseUrl()`: Retorna a URL base baseada no ambiente

### Como Usar

```typescript
import { buildApiUrl, API_CONFIG } from '../config/api';

// Exemplo de uso
const loginUrl = buildApiUrl(API_CONFIG.AUTH.LOGIN);
// Resultado: https://server-conexao-saudavel-production.up.railway.app/api/auth/login

// Em desenvolvimento
const baseUrl = getBaseUrl();
// Resultado: http://10.0.2.2:3000 (em desenvolvimento)
```

## URLs Atualizadas

Todas as URLs hardcoded foram substituídas pela configuração centralizada:

1. **authService.ts**: ✅ Atualizado
2. **SyncService.ts**: ✅ Atualizado  
3. **UsageDataService.ts**: ✅ Atualizado
4. **client.ts**: ✅ Atualizado

## Ambiente de Desenvolvimento

O sistema detecta automaticamente o ambiente:
- `__DEV__ = true`: Usa URL de desenvolvimento
- `__DEV__ = false`: Usa URL de produção

## Notas Importantes

- A URL de desenvolvimento (`10.0.2.2:3000`) é específica para emulador Android
- Para desenvolvimento em dispositivo físico, ajuste a URL conforme necessário
- Todas as requisições agora usam HTTPS em produção 