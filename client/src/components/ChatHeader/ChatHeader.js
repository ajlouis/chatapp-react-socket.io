import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV, faUser} from "@fortawesome/free-solid-svg-icons";
import './ChatHeader.css';
import {formatDate} from "../../utils/helper";

const ChatHeader = ({friendInfo}) => {
    const {isOnline, picture, name, updatedAt} = friendInfo
    return (
        <div className="chat-header">
            <div className="img-container">
                {picture ? (
                        <img
                            alt="image"
                            src={picture}
                        />
                    ) :
                    <FontAwesomeIcon className="icon-block" icon={faUser}/>
                }

            </div>
            <div className="card-detail">
                <h4 className="title">{name ? name : ""}</h4>
                <p className="desc">
                    {isOnline ? "Online" : `Last seen ${formatDate(updatedAt)}`}
                </p>
            </div>
        </div>
    );
};

export default ChatHeader;
