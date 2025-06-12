import { buildApiUrl, API_CONFIG } from '../../config/api';

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

export const getUserToken = async () => Promise.resolve(null);
export const getUserData = async () => Promise.resolve(null);