import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth0();

  const REACT_APP_AUTH0_DOMAIN = "dev-fhx1orey2iklk5am.us.auth0.com";
  const REACT_APP_AUTH0_CLIENT_ID = "sG8DQF3MDxhVwGMoUZAb6t0WGd0SpMnW";

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || "/stores", { replace: true });
  };

  return (
    <Auth0Provider
      domain={REACT_APP_AUTH0_DOMAIN}
      clientId={REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-fhx1orey2iklk5am.us.auth0.com/api/v2/",
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
