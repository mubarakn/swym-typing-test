const SET_WORD = "SETWORD"
const RESET = "RESET"

const currentWordReducer = (state = '', action) => {
    if (action.type === SET_WORD) {
        return action.payload
    }
    else if (action.type === RESET) {
        return ''
    }

    return state
}

export const setWord = (word) => {
    return {
        type: SET_WORD,
        payload: word
    }
}

export const reset = () => {
    return {
        type: RESET
    }
}

export default currentWordReducer