import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {Auth0Provider} from "@auth0/auth0-react";

ReactDOM.render(
  <React.StrictMode>
  <Auth0Provider
            domain="aljinteractive.us.auth0.com"
            clientId="JymCDrP1FKmTvENjrcBbgc2iT8IijtJY"
            redirectUri={window.location.origin}
            audience="this is a unique identifier"
            scope="openid profile email">
            <App/>
        </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
