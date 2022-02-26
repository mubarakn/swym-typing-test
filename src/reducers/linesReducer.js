const LOAD_LINES = 'LOADLINES'

const linesReducer = (state = [], action) => {
    switch (action.type) {
        case LOAD_LINES:
            return action.payload
        default:
            return state
    }
}

export const loadLines = lines => {
    return {
        type: LOAD_LINES,
        payload: lines
    }
}

export default linesReducer