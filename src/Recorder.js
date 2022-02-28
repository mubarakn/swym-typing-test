import store from './store'
import { addLine, editLine, deleteWord, deleteLine } from './reducers/typedLinesReducer'
import { setWordPosition } from './reducers/wordPosReducer'
import { setWord } from './reducers/currentWordReducer'
import { addCorrect, addWrong, deleteScore } from './reducers/scoreReducer'

export const record = (key) => {
    const { dispatch, getState } = store
    const { currentWord, lines, wordPosition, typedLines } = getState()
    const { lineIndex, wordIndex, cursorPos } = wordPosition

    if (key.length === 1) {
        let newWord = ''
        if (key !== ' ') {
            // newWord = `${currentWord}${key}`
            newWord = currentWord.slice(0, cursorPos)+key+currentWord.slice(cursorPos)
            if (!typedLines[lineIndex]) {
                dispatch(addLine([newWord]))
            } else {
                dispatch(editLine(lineIndex, wordIndex, newWord))
            }
            dispatch(setWordPosition(lineIndex, wordIndex, cursorPos+1))
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
                    dispatch(setWordPosition(lineIndex, wordIndex+1, 0))
                } else {
                    dispatch(setWordPosition(lineIndex+1, 0, 0))
                }
            }
        }

        dispatch(setWord(newWord))
    }
    else if (key === 'Backspace') {
        const strLengthBeforeCursor = typedLines[lineIndex][wordIndex].slice(0, cursorPos).length
        console.log('hitting', strLengthBeforeCursor)

        if (strLengthBeforeCursor) {
            const newWord = currentWord.slice(0, cursorPos-1)+currentWord.slice(cursorPos)
            dispatch(editLine(lineIndex, wordIndex, newWord))
            dispatch(setWord(newWord))
            dispatch(setWordPosition(lineIndex, wordIndex, cursorPos-1))
        }
        else if (!strLengthBeforeCursor && wordIndex > 0) {
            const word = typedLines[lineIndex][wordIndex-1]
            dispatch(setWord(word))
            dispatch(setWordPosition(lineIndex, wordIndex-1, word.length))
        }
        else {
            
        }

        /* const currentPosTypedWord = typedLines[lineIndex] && typedLines[lineIndex][wordIndex] ? typedLines[lineIndex][wordIndex] : null
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
        } */
    }
    else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
        switch (key) {
            case 'ArrowLeft':
                const strLengthBeforeCursor = currentWord.slice(0, cursorPos).length
                //if chars available before current pos then just reduce the cursorPos by one
                if (strLengthBeforeCursor > 0) {
                    dispatch(setWordPosition(lineIndex, wordIndex, cursorPos - 1))
                }
                //if no chars before current pos in current word and line has words before current word then jump to previous word
                else if (!strLengthBeforeCursor && wordIndex > 0) {
                    dispatch(setWordPosition(lineIndex, wordIndex-1, typedLines[lineIndex][wordIndex-1].length-1))
                    dispatch(setWord(typedLines[lineIndex][wordIndex-1]))
                }
                // if no chars and also no words before current pos then
                    //if the line index is > 0 then reduce the line index
                    //else do nothing.
                else {
                    const newLineIndex = lineIndex > 0 ? lineIndex-1 : 0
                    dispatch(setWordPosition(newLineIndex, 0, 0))
                    dispatch(setWord(typedLines[newLineIndex][0]))
                }
                break;
            case 'ArrowRight':
                const strLengthAfterCursor = currentWord.slice(cursorPos).length
                if (strLengthAfterCursor > 0) {
                    dispatch(setWordPosition(lineIndex, wordIndex, cursorPos + 1))
                }
                else if (!strLengthAfterCursor && wordIndex < typedLines[lineIndex].length - 1) {
                    dispatch(setWordPosition(lineIndex, wordIndex+1, 0))
                    dispatch(setWord(typedLines[lineIndex][wordIndex+1]))
                }
                else {
                    const newLineIndex = lineIndex < typedLines.length-1 ? lineIndex + 1 : lineIndex
                    dispatch(setWordPosition(newLineIndex, wordIndex, typedLines[newLineIndex][wordIndex].length))
                    dispatch(setWord(typedLines[newLineIndex][wordIndex]))
                }
                break;
            case 'ArrowUp':
                dispatch(setWordPosition(lineIndex > 0 ? lineIndex-1 : lineIndex, 0, 0))
                break;
            case 'ArrowDown':
                dispatch(setWordPosition(lineIndex < typedLines.length-1 ? lineIndex + 1 : lineIndex, 0, 0))
                break;
            default:
                break;
        }
    }
}