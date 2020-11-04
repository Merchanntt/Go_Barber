import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DashBoard from '../pages/DashBoard/index';
import Profile from '../pages/Profile/index';
import CreateAppointment from '../pages/CreateApointment/index';
import AppointmentCreated from '../pages/AppointmentCreated/index';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="dashBoard" component={DashBoard} />
    <App.Screen name="createAppointment" component={CreateAppointment} />
    <App.Screen name="appointmentCreated" component={AppointmentCreated} />

    <App.Screen name="profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
