import "./login.css";
import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {


  const {loginWithRedirect} = useAuth0();

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
          <button className="loginButton" onClick={loginWithRedirect}>Log In</button>

          </div>

        </div>
      </div>
    </div>
  );
}
