import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faSmile,
    faPaperclip,
    faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
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
                {/*<FontAwesomeIcon className="icon-block" icon={faSmile}/>*/}
                {/*<FontAwesomeIcon className="icon-block" icon={faPaperclip}/>*/}
            </div>
            <input
                value={msg}
                onChange={(e) => handleChange(e)}
                onKeyPress={(e) => handleSend(e)}
                className="chat-input"
                placeholder="message"
            />
            {/*<FontAwesomeIcon*/}
            {/*    className="icon-block active"*/}
            {/*    icon={faMicrophone}*/}
            {/*/>*/}
        </div>
    );
};

export default ChatForm;
