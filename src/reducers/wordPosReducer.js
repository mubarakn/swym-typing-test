const SET_POS = "SETPOS"
const RESET = "RESET"

const initialState = {
    lineIndex: 0,
    wordIndex: 0,
    cursorPos: 0,
}

const wordPosReducer = (state = initialState, action) => {
    if (action.type === SET_POS) {
        return action.payload
    }
    else if (action.type === RESET) {
        return initialState
    }

    return state
}

export const setWordPosition = (lineIndex, wordIndex, cursorPos) => {
    return {
        type: SET_POS,
        payload: {
            lineIndex,
            wordIndex,
            cursorPos
        }
    }
}

export const reset = () => {
    return {
        type: RESET
    }
}

export default wordPosReducer