import React, { useEffect } from "react";
import { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI, IDP_NAME } from "./awsConfig";
import { getCognitoTokensFromUrl } from "./utils/tokenUtils";
const LoginButton = ({ onLogin }) => {
  useEffect(() => {
    const { idToken } = getCognitoTokensFromUrl();
    if (idToken) {
      onLogin();
    }
  }, [onLogin]);
  const login = () => {
    const loginUrl = `https://${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=${IDP_NAME}&response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid`;
    window.location.href = loginUrl;
  };
  return <button onClick={login}>🔐 Azure SAML 로그인</button>;
};
export default LoginButton;