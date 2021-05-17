import Login from "./pages/login/Login";
import {useContext, useEffect, useState} from "react";

import axios from 'axios';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import Messenger from "./pages/messenger/Messenger";
import {useAuth0} from '@auth0/auth0-react';


function App() {
    const {loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently} = useAuth0()

    const [myuser, setMyuser] = useState(null);


    useEffect(() => {
        const saveUser = async (user) => {
            console.log('user: ', user);

            const _user = localStorage.getItem("user");
            if (!_user) {
                console.log('trying to save user');

                try {
                    const token = await getAccessTokenSilently();
                    const response = await axios.get('/auth/register', {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    })
                    console.log(response.data);
                    localStorage.setItem("user", JSON.stringify(response.data));
                    setMyuser(response.data)
                } catch (error) {
                    // console.log(error.message);
                }

            } else {
                setMyuser(JSON.parse(_user));
            }
        }

        if (user)
            saveUser(user);
    }, [user])

    async function findAndSaveUser() {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get('/auth/', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
        } catch (error) {
            console.log(error.message);

        }
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    {myuser ? <Messenger/> : <Login/>}
                </Route>
                <Route path="/login">{myuser ? <Redirect to="/"/> : <Login/>}</Route>
                <Route path="/messenger">
                    {!myuser ? <Redirect to="/login"/> : <Messenger/>}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
