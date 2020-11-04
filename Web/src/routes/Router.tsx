import React from 'react';
import {
  Route as ReactDomRoute,
  RouteProps as ReactDomPropsRouter,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/authContext';

interface RouteProps extends ReactDomPropsRouter {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDomRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
