export const getCurrentUsername = () => localStorage.getItem('adminUsername') || 'admin';

export const getUserData = (key: string) => {
  const username = getCurrentUsername();
  const dataKey = `user_${username}_${key}`;
  return localStorage.getItem(dataKey);
};

export const setUserData = (key: string, value: any) => {
  const username = getCurrentUsername();
  const dataKey = `user_${username}_${key}`;
  localStorage.setItem(dataKey, typeof value === 'string' ? value : JSON.stringify(value));
};

export const getUserDataParsed = (key: string, defaultValue: any = null) => {
  const username = getCurrentUsername();
  const dataKey = `user_${username}_${key}`;
  const saved = localStorage.getItem(dataKey);
  return saved ? JSON.parse(saved) : defaultValue;
};
