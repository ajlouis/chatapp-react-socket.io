import {useState} from "react";

import "./ChatForm.css";

const ChatForm = ({sendMsg, sendTyping}) => {

    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setMsg((e.target.value));
        sendTyping({value: e.target.value, type: "typing", theme: "text"});
    }

    const handleSend = (e) => {
        if (e.key === "Enter") {
            setMsg("");
            sendMsg({value: e.target.value, type: "message", theme: "text"});
        }
    }

    return (
        <div className="chat-form">
            <div className="action-btn">
            </div>
            <input
                value={msg}
                onChange={(e) => handleChange(e)}
                onKeyPress={(e) => handleSend(e)}
                className="chat-input"
                placeholder="message"
            />
        </div>
    );
};

export default ChatForm;
