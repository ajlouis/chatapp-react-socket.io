import Login from "./pages/login/Login";
import {LOGIN, USER_LIST} from "./utils/apiEndpionts";
import {useEffect, useReducer, useRef, useState} from "react";
import axios from 'axios';
import './App.css';
import SocketContext from "./context/SocketContext";
import io from 'socket.io-client';
import friendsListReducer from "./reducer/friendsListReducer";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import {useAuth0, User} from '@auth0/auth0-react';
import ProfileSection from "./components/ProfileSection/ProfileSection";
import SearchPeople from "./components/SearchPeople/SearchPeople";
import ChatCardsListing from "./components/ChatCardsListing/ChatCardsListing";
import ChatSection from "./components/ChatSection/ChatSection";
import {useCookies} from "react-cookie";

import AuthContext from "./context/AuthContext";

const initialState = {};
const socket = io.connect("http://localhost:8800", {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
})

function App() {
    const {loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [cookies, setCookie, removeCookie] = useCookies(["whatsappUser"]);
    const [error, setError] = useState(null);
    const [userObj, setUserObj] = useState(() => {
        return cookies.user;
    });
    const [recentMsg, setRecentMsg] = useState({});
    const [recentOnlineFriend, setRecentOnlineFriend] = useState({});
    const [recentOfflineFriend, setRecentOfflineFriend] = useState({});
    const [accessToken, setAccessToken] = useState('')


    const [friendsList, friendsListDispatch] = useReducer(
        friendsListReducer,
        initialState
    )

    useEffect(() => {
        if (user)
            saveUser(user);
    }, [user]);

    const saveUser = async (user) => {
        console.log('user: ', user);
        // const _user = JSON.parse(localStorage.getItem("user"));
        const _user = cookies.user;
        if (!_user) {
            console.log('trying to save user');
            try {
                const token = await getAccessTokenSilently();
                console.log('token', token);
                setAccessToken(token);
                const response = await axios.get(`${LOGIN}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                // localStorage.setItem("user", JSON.stringify(response.data));
                setCookie("user", response.data);
                setUserObj(response.data);
                joinUser(response.data);
                await getFriendsList(response.data, token);

            } catch (error) {
                setError(error);
                console.log(error.message);
            }
        } else {
            setUserObj(_user);
            joinUser(_user);
            const token = await getAccessTokenSilently();
            await getFriendsList(_user, token);
        }
    }

    const handleLogout = () => {
        // localStorage.removeItem("user");
        removeCookie("user");
        setUserObj(null);
    }

    const getFriendsList = async (userData, token) => {
        try {
            const response = await axios.get(`${USER_LIST}/${userData.sessionId}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            console.log('friendsList', response.data)
            friendsListDispatch({type: "FRIENDS", payload: response.data});
        } catch (error) {
            setError(error);
            return false;
        }
    }


    const onlineOfflineUser = () => {
        socket.on("new-online-user", (data) => {
            friendsListDispatch({type: "NEW_FRIEND", payload: data});
            setRecentOnlineFriend(data);
        })

        socket.on("new-offline-user", (data) => {
            setRecentOfflineFriend(data);
        })

    }

    const joinUser = (userData) => {
        let initData = {
            createdAt: userData.createdAt,
            name: userData.name,
            picture: userData.picture,
            sessionId: userData.sessionId,
            updated_at: userData.updatedAt,
            _id: userData._id
        }

        socket.emit("join-user", initData, (cbData) => {
            console.log("user joined");
        });

        socket.on("receive-msg", (data) => {
            console.log(data)
            updateRecentMsg(data);
            setRecentMsg(data);
        })

        socket.on("user-typing", (data) => {
            console.log(data)
            updateRecentMsg(data);
        })
    }

    const updateRecentMsg = (data) => {
        friendsListDispatch({type: "RECENT_MSG", payload: data});
    }

    return (
        <>
            {!(userObj && userObj.sessionId) ? (
                <Login loginWithRedirect={loginWithRedirect}/>
            ) : (
                <AuthContext.Provider value={userObj}>
                    <SocketContext.Provider value={socket}>
                        <Router>
                            <div className="App">
                                <div className="left-side">
                                    <ProfileSection handleLogout={handleLogout}/>
                                    {/*<SearchPeople/>*/}
                                    <ChatCardsListing friendsList={friendsList}/>
                                </div>
                                <Switch>
                                    <Route path="/:id">
                                        <div className="right-side">
                                            <ChatSection
                                                updateRecentMsg={updateRecentMsg}
                                                recentMsg={recentMsg}
                                                recentOnlineFriend={recentOnlineFriend}
                                                recentOfflineFriend={recentOfflineFriend}
                                            />
                                        </div>
                                    </Route>
                                </Switch>
                            </div>
                        </Router>
                    </SocketContext.Provider>
                </AuthContext.Provider>
            )}
        </>
    );
}

export default App;
