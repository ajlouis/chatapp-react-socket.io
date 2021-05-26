import './ProfileSection.css'
import AuthContext from "../../context/AuthContext";
import {useContext} from "react";

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
                Logout
            </div>
        </div>
    )
}

export default ProfileSection;
