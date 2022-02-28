import store from './store'
import { addLine, editLine, deleteWord, addWord } from './reducers/typedLinesReducer'
import { setWordPosition } from './reducers/wordPosReducer'
import { setWord } from './reducers/currentWordReducer'
import { addCorrect, addWrong, deleteScore } from './reducers/scoreReducer'

export const record = (key) => {
    const { dispatch, getState } = store
    const { currentWord, lines, wordPosition, typedLines } = getState()
    const { lineIndex, wordIndex, cursorPos } = wordPosition

    const calculateScore = () => {
        dispatch(deleteScore(lineIndex, wordIndex))
        const actualWord = lines[lineIndex][wordIndex]
        if (typedLines[lineIndex]) {
            if (actualWord === typedLines[lineIndex][wordIndex]) {
                dispatch(addCorrect(lineIndex, wordIndex))
            }
            else {
                dispatch(addWrong(lineIndex, wordIndex))
            }
        }
    }

    if (key.length === 1) {
        let newWord = ''
        if (key !== ' ') {
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
            if (typedWord) {
                const wordsInLine = typedLines[lineIndex].length
                if (wordIndex < wordsInLine-1 && lines[lineIndex].length === wordsInLine) {
                    return
                }


                if (wordIndex < lines[lineIndex].length-1) {
                    const charsAfterIndex = typedLines[lineIndex][wordIndex].slice(cursorPos)
                    if (!charsAfterIndex) {
                        dispatch(addWord(lineIndex, wordIndex+1, ''))
                    }
                    else {
                        dispatch(editLine(lineIndex, wordIndex, typedLines[lineIndex][wordIndex].slice(0, cursorPos)))
                        dispatch(addWord(lineIndex, wordIndex+1, charsAfterIndex))
                        
                    }
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
        if (strLengthBeforeCursor) {
            const newWord = currentWord.slice(0, cursorPos-1)+currentWord.slice(cursorPos)
            dispatch(editLine(lineIndex, wordIndex, newWord))
            dispatch(setWord(newWord))
            dispatch(setWordPosition(lineIndex, wordIndex, cursorPos-1))
        }
        else if (!strLengthBeforeCursor && wordIndex > 0) {
            const leftoverChars = typedLines[lineIndex][wordIndex]
            const word = typedLines[lineIndex][wordIndex-1]+leftoverChars
            dispatch(editLine(lineIndex, wordIndex-1, word))
            dispatch(deleteWord(lineIndex, wordIndex))
            dispatch(setWord(word))
            dispatch(setWordPosition(lineIndex, wordIndex-1, word.length - leftoverChars.length))
        }
        else {
            if (!lineIndex) {
                return
            }

            const newLineIndex = lineIndex-1
            const newWordIndex = typedLines[newLineIndex].length-1
            const newCursorPos = typedLines[newLineIndex][newWordIndex].length
            if (!currentWord) {
                dispatch(deleteWord(lineIndex, wordIndex))
            }
            dispatch(setWordPosition(newLineIndex, newWordIndex, newCursorPos))
            dispatch(setWord(typedLines[newLineIndex][newWordIndex]))
        }
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
                    const newWordIndex = typedLines[newLineIndex].length ? typedLines[newLineIndex].length-1 : 0
                    const tWord = typedLines[newLineIndex][newWordIndex]
                    dispatch(setWordPosition(newLineIndex, newWordIndex, tWord.length))
                    dispatch(setWord(typedLines[newLineIndex][newWordIndex]))
                }
                break;
            case 'ArrowUp':
                {
                    const newLine = lineIndex > 0 ? lineIndex-1 : lineIndex
                    const newWordIndex = Math.min(wordIndex, typedLines[newLine].length ? typedLines[newLine].length-1 : 0)
                    const newCursorPos = typedLines[newLine][newWordIndex].length-1
                    dispatch(setWordPosition(newLine, newWordIndex, newCursorPos))
                    dispatch(setWord(typedLines[newLine][newWordIndex] || ''))
                }
                break;
            case 'ArrowDown':
                {
                    const newLine = lineIndex < typedLines.length-1 ? lineIndex + 1 : lineIndex
                    const newWordIndex = Math.min(wordIndex, typedLines[newLine].length ? typedLines[newLine].length-1 : 0)
                    const newCursorPos = typedLines[newLine][newWordIndex].length-1
                    dispatch(setWordPosition(newLine, newWordIndex, newCursorPos))
                    dispatch(setWord(typedLines[newLine][newWordIndex] || ''))
                }
                break;
            default:
                break;
        }
    }

    calculateScore()
}