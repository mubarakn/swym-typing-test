const ADD_CORRECT = "ADDCORRECT"
const ADD_WRONG = "ADDWRONG"
const DELETE_SCORE = "DELETESCORE"
const RESET = "RESET"

const initialState = { corrects: {}, wrongs: {} }

const scoreReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_CORRECT:
            {
                let newCorrects = {...state.corrects, [action.payload]: 10 }
                let newWrongs = {...state.wrongs}
                
                if (newWrongs[action.payload]) {
                    delete newWrongs[action.payload]
                }
                return { corrects: newCorrects, wrongs: newWrongs }
            }
        case ADD_WRONG:
            {
                let newCorrects = {...state.corrects }
                let newWrongs = {...state.wrongs, [action.payload]: 5}
                
                if (newCorrects[action.payload]) {
                    delete newCorrects[action.payload]
                }
                return { corrects: newCorrects, wrongs: newWrongs }
            }
        case DELETE_SCORE:
            {
                let newCorrects = {...state.corrects }
                let newWrongs = {...state.wrongs}
                delete newCorrects[action.payload]
                delete newWrongs[action.payload]
                return { corrects: newCorrects, wrongs: newWrongs }
            }
        case RESET:
            return initialState
        default:
            return state
    }
}

const makeKey = (lineIdx, wordIdx) => {
    return `${lineIdx}-${wordIdx}`
}

export const addCorrect = (lineIndex, wordIndex) => {
    return {
        type: ADD_CORRECT,
        payload: makeKey(lineIndex, wordIndex)
    }
}

export const addWrong = (lineIndex, wordIndex) => {
    return {
        type: ADD_WRONG,
        payload: makeKey(lineIndex, wordIndex)
    }
}

export const deleteScore = (lineIndex, wordIndex) => {
    return {
        type: DELETE_SCORE,
        payload: makeKey(lineIndex, wordIndex)
    }
}

export const reset = () => {
    return {
        type: RESET
    }
}

export default scoreReducer