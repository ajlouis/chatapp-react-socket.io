const chatsReducer = (currentState, action) => {
    let newState = [...currentState];
    switch (action.type) {
        case "CHATS":
            newState = [...newState, ...action.payload];
            return newState;
        case "RESET_CHATS":
            newState = action.payload;
            return newState;
        default:
            return currentState;
    }
}

export default chatsReducer;
