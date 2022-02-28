const ADD_LINE = "ADDLINE"
const EDIT_LINE = "EDITLINE"
const DELETE_WORD = "DELETEWORD"
const DELETE_LINE = "DELETELINE"
const RESET = "RESET"
const ADD_WORD = "ADDWORD"

const initialState = [['']]

const typedLinesReducer = (state = initialState, action) => {

    switch (action.type) {
        case ADD_LINE:
            return [...state, action.payload]
        case EDIT_LINE:
            {
                const { lineIndex, wordIndex, word } = action.payload
                return state.map((line, sLineIdx) => {
                    if (sLineIdx !== lineIndex) {
                        return line
                    }
                    
                    if(line[wordIndex] === undefined) {
                        return [...line, word]
                    }
                    return line.map((sWord, sWordIdx) => {
                        return sWordIdx === wordIndex ? word : sWord
                    })
                })
            }
        case DELETE_WORD:
            {
                const { lineIndex, wordIndex } = action.payload
                const newState = state.map((line, sLineIdx) => {
                    if (sLineIdx !== lineIndex) {
                        return line
                    }
                    return line.filter((_, sWordIdx) => sWordIdx !== wordIndex)
                })
                return newState
            }
        case DELETE_LINE:
            const newState = state.filter((_, idx) => idx !== action.payload)
            return newState
        case RESET:
            return initialState
        case ADD_WORD:
            {
                const { lineIndex, wordIndex, word } = action.payload
                return state.map((line, lineIdx) =>{
                    if (lineIdx === lineIndex) {
                        return [...line.slice(0, wordIndex), word, ...line.slice(wordIndex)]
                    }
                    return line
                })
            }
        default:
            return state
    }
}

export const addLine = (line) => {
    return {
        type: ADD_LINE,
        payload: line
    }
}

export const editLine = (lineIndex, wordIndex, word) => {
    return {
        type: EDIT_LINE,
        payload: {
            lineIndex,
            wordIndex,
            word
        }
    }
}

export const deleteWord = (lineIndex, wordIndex) => {
    return {
        type: DELETE_WORD,
        payload: {
            lineIndex,
            wordIndex
        }
    }
}

export const deleteLine = lineIndex => {
    return {
        type: DELETE_LINE,
        payload: lineIndex
    }
}

export const reset = () => {
    return {
        type: RESET
    }
}

export const addWord = (lineIndex, wordIndex, word) => {
    return {
        type: ADD_WORD,
        payload: {
            lineIndex,
            wordIndex,
            word
        }
    }
}

export default typedLinesReducer