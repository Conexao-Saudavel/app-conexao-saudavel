import { buildApiUrl, API_CONFIG } from '../../config/api';
import { getAccessToken } from '../../services/storage/tokenStorage';

// Este arquivo será implementado posteriormente quando a API estiver pronta
export const login = async (email: string, password: string) => {
  const response = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    // Tenta mostrar detalhes do erro se houver
    const errorMsg = data.message || 'Erro ao fazer login.';
    const errorDetails = data.details ? `\n${data.details}` : '';
    throw new Error(errorMsg + errorDetails);
  }
  return data;
};

export const logout = async () => Promise.resolve();

export const register = async (data: any) => {
  // Converte a data para yyyy-MM-dd
  let dateOfBirth = data.birthDate;
  if (dateOfBirth && dateOfBirth.includes('/')) {
    // Se vier no formato dd/MM/yyyy, converte para yyyy-MM-dd
    const [day, month, year] = dateOfBirth.split('/');
    dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const payload: any = {
    email: data.email,
    username: data.email.split('@')[0],
    password: data.password,
    confirm_password: data.confirmPassword,
    full_name: data.fullName,
    date_of_birth: dateOfBirth,
    gender: data.gender.toLowerCase(),
    user_type: data.userType.toLowerCase(),
    settings: { notifications: { email: true, push: true } },
    theme: 'light',
  };
  if (data.iesId) {
    payload.institution_id = data.iesId;
  }

  const response = await fetch(buildApiUrl(API_CONFIG.AUTH.REGISTER), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Mostra detalhes se houver
    const details = errorData.details || errorData.message;
    throw new Error(details || 'Erro ao registrar usuário.');
  }

  return response.json();
};

export const getUserToken = async () => {
  return await getAccessToken();
};

export const getUserData = async () => {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.log('Token não encontrado, retornando dados mockados');
      throw new Error('Token de acesso não encontrado');
    }

    const apiUrl = buildApiUrl(API_CONFIG.USER.PROFILE);
    console.log('Tentando obter dados do usuário da API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Resposta da API:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro da API:', errorData);
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    }

    const userData = await response.json();
    console.log('Dados do usuário obtidos com sucesso:', userData);
    return userData;
  } catch (error: any) {
    console.error('Erro detalhado ao obter dados do usuário:', error);
    
    // Se for erro de rede ou API indisponível, retornar dados mockados
    if (error instanceof TypeError || (error.message && error.message.includes('fetch'))) {
      console.log('Erro de rede detectado, retornando dados mockados');
      return {
        full_name: 'Usuário Teste',
        email: 'usuario@teste.com',
        date_of_birth: '01/01/1990',
        gender: 'Não informado',
        user_type: 'Estudante',
        avatar_url: null,
      };
    }
    
    // Para outros erros, também retornar dados mockados como fallback
    console.log('Retornando dados mockados como fallback');
    return {
      full_name: 'Usuário',
      email: 'usuario@email.com',
      date_of_birth: '01/01/1990',
      gender: 'Não informado',
      user_type: 'Estudante',
      avatar_url: null,
    };
  }
};

export const updateUserProfile = async (userData: any) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Token de acesso não encontrado');
    }

    const response = await fetch(buildApiUrl(API_CONFIG.USER.PROFILE), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao atualizar perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};