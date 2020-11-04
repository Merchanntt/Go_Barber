import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/SignIn/index';
import SignUp from '../pages/SignUp/index';
import ForgotPassword from '../pages/ForgotPassword/index';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <Auth.Screen name="signIn" component={SignIn} />
    <Auth.Screen name="signUp" component={SignUp} />
    <Auth.Screen name="forgotPassword" component={ForgotPassword} />
  </Auth.Navigator>
);

export default AuthRoutes;
