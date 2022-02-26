const SET_LEVEL = "SETLEVEL"
const RESET = "RESET"

const initialState = ''

const levelReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_LEVEL:
            return action.payload
        case RESET:
            return initialState
        default:
            return state
    }
}

export const setLevel = level => {
    return {
        type: SET_LEVEL,
        payload: level
    }
}

export const reset = () => {
    return {
        type: RESET
    }
}

export default levelReducer