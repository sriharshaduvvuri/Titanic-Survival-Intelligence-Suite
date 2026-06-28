export const getStoredToken = (): string | null => {
  return localStorage.getItem('titanic_auth_token');
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem('titanic_auth_token', token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem('titanic_auth_token');
};

export const getStoredUser = (): any | null => {
  const user = localStorage.getItem('titanic_user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user: any): void => {
  localStorage.setItem('titanic_user', JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem('titanic_user');
};

export const clearSession = (): void => {
  removeStoredToken();
  removeStoredUser();
};
