import apiClient from './apiClient';
import { logout as logoutState } from '../store/slices/authSlice';

export const checkAvailability = async data => {
  const res = await apiClient.post('auth/check-availability', data);

  return res;
};

export const signUp = async (user, avatar) => {
  const formData = new FormData();
  formData.append(
    'user',
    new Blob([JSON.stringify(user)], { type: 'application/json' })
  );
  formData.append('avatar', avatar);
  const res = await apiClient.post('auth/sign-up', formData, {
    'Content-Type': 'multipart/form-data',
  });
  return res;
};

export const login = async data => {
  const res = await apiClient.post('/auth/login', data);
  return res;
};

export const logout = async () => {
  await apiClient.post('/auth/logout');
  localStorage.removeItem('accessToken');
  logoutState();
};

export const refreshToken = async () => {
  const res = await apiClient.post('/auth/refresh-token', {});
  return res;
}

export const autoLogin = async () => {
  console.log(localStorage.getItem("accessToken"))
  const res = await apiClient.get('/auth/me')
  return res;
}