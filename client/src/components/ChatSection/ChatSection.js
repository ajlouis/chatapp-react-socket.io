import ChatHeader from "../ChatHeader/ChatHeader";
import Chat from "../Chat/Chat";
import ChatForm from "../ChatForm/ChatForm";
import {useContext, useEffect, useReducer, useState} from "react";
import AuthContext from "../../context/AuthContext";
import SocketContext from "../../context/SocketContext";
import chatsReducer from "../../reducer/chatsReducer";
import {useParams} from "react-router-dom";
import axios from "axios";
import {USER, CHATS} from "./../../utils/apiEndpionts";
import {useAuth0} from "@auth0/auth0-react";


const initialChatsState = [];
const ChatSection = ({
                         updateRecentMsg,
                         recentMsg,
                         recentOfflineFriend,
                         recentOnlineFriend
                     }) => {

    const {getAccessTokenSilently} = useAuth0();
    const userObj = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [error, setError] = useState({});
    const [friendInfo, setFriendInfo] = useState({})
    const [isChatLoading, setChatLoading] = useState(false);
    const [chats, chatsDispatch] = useReducer(chatsReducer, initialChatsState);
    const params = useParams();
    const paramId = params.id;


    useEffect(() => {
        getFriendInfo();
        getChats();

        return () => {
            chatsDispatch({type: "RESET_CHATS", payload: []});
        }
    }, [paramId]);


    useEffect(() => {
        if (isChatLoading && recentMsg && paramId === recentMsg.senderId) {
            chatsDispatch({type: "CHATS", payload: [recentMsg]});
        }
    }, [recentMsg.time]);

    useEffect(() => {
        if (paramId === recentOnlineFriend.sessionId) {
            setFriendInfo({...friendInfo, isOnline: true});
        }
    }, [recentOnlineFriend]);

    useEffect(() => {
        if (paramId === recentOfflineFriend.sessionId) {
            setFriendInfo({
                ...friendInfo,
                isOnline: false,
                updatedAt: recentOfflineFriend.time,
            });
        }
    }, [recentOfflineFriend]);


    const sendMsg = (value, type, theme) => {
        socket.emit(
            "send-msg",
            {
                senderId: userObj.sessionId,
                receiverId: paramId,
                msg: value, type, theme,
            },
            (cbData) => {
                updateRecentMsg(cbData);
                chatsDispatch({type: "CHATS", payload: [cbData]});
            }
        );
    };


    const sendTyping = (value) => {
        socket.emit(
            "user-typing", {
                senderId: userObj.sessionId,
                receiverId: paramId,
                msg: value,
            }, (cbData) => {

            }
        );
    }

    const getFriendInfo = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${USER}/${paramId}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            const userOfflineRes = await checkIfUserOffline(response.data);
            let userAvailability = {
                isOnline: true,
            }

            if (userOfflineRes) {
                userAvailability.isOnline = false;
                userAvailability["updatedAt"] = userOfflineRes.time;
            }
            console.log('friendInfo', response.data);
            setFriendInfo({...response.data, ...userAvailability});


        } catch (error) {
            setError(error);
            return false;
        }
    }


    const checkIfUserOffline = async () => {
        try {
            return null;
        } catch (e) {
            setError(error);
            return false;
        }
    }


    const getChats = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.post(`${CHATS}/`, {
                data: {
                    senderId: userObj.senderId,
                    receiverId: paramId
                },
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("chats")
            chatsDispatch({type: "CHATS", payload: response.data});
            setChatLoading(true);

        } catch (error) {
            setError(error);
            return false;
        }

    }

    return (
        <div>
            <ChatHeader friendInfo={friendInfo}/>
            <Chat
                sessionId={paramId}
                friendName={friendInfo && friendInfo.nickname}
                chats={chats}
            />
            <ChatForm
                sendMsg={sendMsg}
                sendTyping={sendTyping}
            />
        </div>
    );
};

export default ChatSection;
