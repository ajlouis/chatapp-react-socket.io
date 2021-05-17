import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {io} from "socket.io-client";
import {useAuth0} from "@auth0/auth0-react";


export default function Messenger() {

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const socket = useRef();
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    const scrollRef = useRef();

    const {loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently} = useAuth0()

    useEffect(() => {
        const friends = onlineUsers.filter((friend) => {
            return friend.name !== user.name;
        })
        setOnlineFriends(friends);
    }, [user, onlineUsers]);


    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user.name);
        socket.current.on("getUsers", (users) => {
            console.log('all online users in messenger::', users);


            setOnlineUsers(
                users
            );
        });
    }, [user]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user.name);
                console.log('conversations::', res.data);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user.name]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user.name,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== user.name
        );

        socket.current.emit("sendMessage", {
            senderId: user.name,
            receiverId,
            text: newMessage,
        });

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };

    const findAndUpdateConversation = async (senderId, receiverId) => {
        try {
            const res = await axios.post("/conversation", {senderId, receiverId})
            setConversations(res.data);
        } catch (e) {

        }

    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    return (
        <>
            <Topbar/>
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput"/>
                        {conversations && (conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={user}/>
                            </div>
                        )))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages && (messages.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender === user.name}/>
                                        </div>
                                    )))}
                                </div>
                                <div className="chatBoxBottom">
                  <textarea
                      className="chatMessageInput"
                      placeholder="write something..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                  ></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
                        )}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        {/*<ChatOnline*/}
                        {/*  onlineUsers={onlineUsers}*/}
                        {/*  currentId={user.name}*/}
                        {/*  setCurrentChat={setCurrentChat}*/}
                        {/*/>*/}

                        <div className="chatOnline">
                            {onlineFriends.map((o) => (
                                <div className="chatOnlineFriend">
                                    <div className="chatOnlineImgContainer">
                                        <img
                                            className="chatOnlineImg"
                                            src={
                                                o?.picture
                                                    ? PF + o.picture
                                                    : PF + "person/noAvatar.png"
                                            }
                                            alt=""
                                        />
                                        <div className="chatOnlineBadge"></div>
                                    </div>
                                    <span className="chatOnlineName">{o?.name}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
