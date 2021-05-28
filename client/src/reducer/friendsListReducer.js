const friendsListReducer = (currentState, action) => {
    let newState = { ...currentState };
    switch (action.type) {
        case "FRIENDS":
            newState = action.payload;
            return newState;
        case "NEW_FRIEND":
            newState = {
                ...newState,
                [action.payload.sessionId]: action.payload,
            }
            return newState;
        case "RECENT_MSG":
            if(newState[action.payload.senderId]){
                newState[action.payload.senderId]["recentMsg"] = {
                    time: action.payload.time,
                    msg: action.payload.msg
                }
            }
            if(newState[action.payload.receiverId]){
                newState[action.payload.receiverId]["recentMsg"] = {
                    time: action.payload.time,
                    msg: action.payload.msg
                }
            }
            return newState;
        default:
            return currentState;
    }
}

export default friendsListReducer;
