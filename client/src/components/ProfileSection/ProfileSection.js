import './ProfileSection.css'
import AuthContext from "../../context/AuthContext";
import {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faUser} from "@fortawesome/free-solid-svg-icons";

const ProfileSection = ({handleLogout}) => {
    const userObj = useContext(AuthContext);
    const {picture, name} = userObj;
    return (
        <div className="profile-section">
            <div className="img-container">
                <img alt="image" src={picture}/>
            </div>
            {name}
            <div className="action-items" onClick={handleLogout}>
               <span style={{fontWeight: "bold",cursor:"pointer"}} >Logout</span>


            </div>
        </div>
    )
}

export default ProfileSection;
