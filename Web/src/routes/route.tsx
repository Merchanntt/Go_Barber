import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Router';

import signIn from '../pages/SignIn/index';
import signUp from '../pages/SignUp/index';
import ForgotPassword from '../pages/ForgotPassword/index';
import ResetPassword from '../pages/ResetPassword/index';

import Profile from '../pages/Profile/index';
import dashBoard from '../pages/DashBoard/index';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={signIn} />
    <Route path="/signup" component={signUp} />
    <Route path="/forgot_password" component={ForgotPassword} />
    <Route path="/reset_password" component={ResetPassword} />

    <Route path="/dashboard" component={dashBoard} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />
  </Switch>
);

export default Routes;
