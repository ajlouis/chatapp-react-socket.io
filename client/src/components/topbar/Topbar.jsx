import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

export default function Topbar() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently} = useAuth0()
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Magnum Chat</span>
        </Link>
      </div>
    </div>
  );
}
