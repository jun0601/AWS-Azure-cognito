import React, { useState } from "react";
import S3Manager from "./S3Manager";
import LoginButton from "./LoginButton";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h2>React + Cognito SAML + S3 데모</h2>
      <LoginButton onLogin={handleLogin} />
      <hr />
      {isLoggedIn && <S3Manager />}
    </div>
  );
}
export default App;