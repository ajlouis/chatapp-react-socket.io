import "./rightbar.css";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";


export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently} = useAuth0()


  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/");
        console.log('friendList::', friendList);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    // try {
    //   if (followed) {
    //     await axios.put(`/users/${user._id}/unfollow`, {
    //       userId: currentUser._id,
    //     });
    //     dispatch({ type: "UNFOLLOW", payload: user._id });
    //   } else {
    //     await axios.put(`/users/${user._id}/follow`, {
    //       userId: currentUser._id,
    //     });
    //     dispatch({ type: "FOLLOW", payload: user._id });
    //   }
    //   setFollowed(!followed);
    // } catch (err) {
    // }
  };


  const ProfileRightbar = () => {
    return (
      <>

        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.picture
                      ? PF + friend.picture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <ProfileRightbar />
      </div>
    </div>
  );
}
