import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import wordsGenerator from './wordsGenerator'
import { loadLines } from './reducers/linesReducer'
import { chunk } from 'lodash'
import { record } from './Recorder'
import Timer from './components/Timer';

const TypingTest = ({ time, onDone }) => {
    const timerRef = useRef(null)
    const dispatch = useDispatch()
    const { lines, level, wordPosition, typedLines, currentWord, score } = useSelector(state => state)

    useEffect(() => {
        const words = wordsGenerator(level)
        const newLines = chunk(words, 7)
        dispatch(loadLines(newLines))
    }, [level])

    useEffect(() => {
        const currentLineElement = document.getElementById('currentLine')
        if (currentLineElement) {
            currentLineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [currentWord, wordPosition])

    useEffect(() => {
        const listener = event => {
            const { key } = event
            if(key.length === 1 || key === 'Backspace') {
                event.preventDefault()
                if (!timerRef.current.isRunning) {
                    timerRef.current.start()
                }
                record(key)
            }
        }
        window.addEventListener('keydown', listener)

        return () => {
            window.removeEventListener('keydown', listener)
        }
    }, [])

    return (
        <div className='w-full shrink-0 flex flex-col items-center'>
            <div className='flex w-full justify-center items-center p-2'>
                <Timer ref={timerRef} seconds={time} onExpired={(spentSeconds) => {
                    if(typeof onDone === 'function') onDone(spentSeconds)
                } } />

                <button className='ml-auto border border-transparent hover:border-gray-600 px-4 py-1 rounded-lg' onClick={() => timerRef.current.stop()}>close</button>
            </div>
            <div className='w-full flex-1 overflow-hidden text-3xl p-6'>
                {lines.map((line, lineIndex) => {
                    return (
                        <div key={`line-${lineIndex}`}>
                            <p className={`whitespace-nowrap h-14 text-gray-600 mb-4 mt-10`}>
                                {line
                                    .map((word, wordIndex) => {
                                        let isWrongWord = !!score.wrongs[`${lineIndex}-${wordIndex}`]
                                        return (
                                            <span
                                                key={`${wordIndex}-${word}`}
                                                className={`transition duration-500 ease-in-out ${isWrongWord && 'text-pink-500'} ${wordIndex === wordPosition.wordIndex && lineIndex === wordPosition.lineIndex ? 'text-yellow-500' : ''}`}>
                                                {word}
                                            </span>
                                        )
                                    })
                                    .reduce((prev, curr) => {
                                        return [prev, ' ', curr]
                                    })}</p>
                            <p className='whitespace-nowrap border-b h-10 text-gray-500' id={lineIndex === wordPosition.lineIndex ? 'currentLine' : undefined }>
                                {typedLines[lineIndex] && (
                                    typedLines[lineIndex]
                                    .map((word, wordIdx) => {
                                        return (
                                            <span
                                                key={`typed-${wordIdx}-${word}`}>
                                                {word}
                                            </span>
                                        )
                                    })
                                    .reduce((prev, curr) => {
                                        return [prev, ' ', curr]
                                    }, '')
                                )}
                                {lineIndex === wordPosition.lineIndex && <span className='caret inline-block w-[2px] bg-black'>|</span>}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
      )
}

export default TypingTest