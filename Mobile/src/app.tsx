import 'react-native-gesture-handler';

import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './hooks/index';

import Routes from './routes/index';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <AuthNavigation>
      <View style={{ flex: 1, backgroundColor: '#312e38' }}>
        <Routes />
      </View>
    </AuthNavigation>
  </NavigationContainer>
);

export default App;
