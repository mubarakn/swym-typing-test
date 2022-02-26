import store from './store'
import { addLine, editLine, deleteWord, deleteLine } from './reducers/typedLinesReducer'
import { setWordPosition } from './reducers/wordPosReducer'
import { setWord } from './reducers/currentWordReducer'
import { addCorrect, addWrong, deleteScore } from './reducers/scoreReducer'

export const record = (key) => {
    const { dispatch, getState } = store
    const { currentWord, lines, wordPosition, typedLines } = getState()
    const { lineIndex, wordIndex } = wordPosition
    if (key.length === 1) {
        let newWord = ''
        if (key !== ' ') {
            newWord = `${currentWord}${key}`
            if (!typedLines[lineIndex]) {
                dispatch(addLine([newWord]))
            } else {
                dispatch(editLine(lineIndex, wordIndex, newWord))
            }
        }

        if (key === ' ') {
            const typedWord = typedLines[lineIndex][wordIndex]

            //For score
            const actualWord = lines[lineIndex][wordIndex]
            if (actualWord === typedWord) {
                dispatch(addCorrect(lineIndex, wordIndex))
            }
            else {
                dispatch(addWrong(lineIndex, wordIndex))
            }


            if (typedWord) {
                if (wordIndex < lines[lineIndex].length-1) {
                    dispatch(setWordPosition(lineIndex, wordIndex+1))
                } else {
                    dispatch(setWordPosition(lineIndex+1, 0))
                }
            }
        }

        dispatch(setWord(newWord))
    }
    else if (key === 'Backspace') {
        const currentPosTypedWord = typedLines[lineIndex] && typedLines[lineIndex][wordIndex] ? typedLines[lineIndex][wordIndex] : null
        if (!currentPosTypedWord) {
            dispatch(deleteWord(lineIndex, wordIndex))
            dispatch(deleteScore(lineIndex, wordIndex))
            if (wordIndex > 0) {
                dispatch(setWordPosition(lineIndex, wordIndex-1))
                dispatch(setWord(typedLines[lineIndex][wordIndex-1]))
            } else {
                if(lineIndex > 0) {
                    dispatch(deleteLine(lineIndex))
                    dispatch(setWordPosition(lineIndex-1, typedLines[lineIndex-1].length-1))
                }
            }
        } else {
            const newCurrentWord = currentPosTypedWord.slice(0, currentPosTypedWord.length-1)
            dispatch(setWord(newCurrentWord))
            dispatch(editLine(lineIndex, wordIndex, newCurrentWord))
        }
    }
}