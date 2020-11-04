import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../hooks/auth';

import AuthProvider from './auth.routes';
import AppProvider from './app.routes';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff9000" />
      </View>
    );
  }

  return user ? <AppProvider /> : <AuthProvider />;
};

export default Routes;
