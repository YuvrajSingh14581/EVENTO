import { User } from '@/types';

// Mock authentication functions
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const login = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password') {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
};

export const loginWithGoogle = async (): Promise<User> => {
  // Simulate Google OAuth
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const googleUser: User = {
    id: 'google-' + Date.now(),
    email: 'user@gmail.com',
    name: 'Google User',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    googleId: 'google-123456'
  };
  
  localStorage.setItem('user', JSON.stringify(googleUser));
  return googleUser;
};

export const register = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  };
  
  localStorage.setItem('user', JSON.stringify(newUser));
  return newUser;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};