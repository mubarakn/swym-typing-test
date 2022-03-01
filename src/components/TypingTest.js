import { useEffect, useRef, useState, useCallback, forwardRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import wordsGenerator from '../wordsGenerator'
import { loadLines } from '../reducers/linesReducer'
import { chunk } from 'lodash'
import { record } from '../Recorder'
import Timer from './Timer';
import Modal from './Modal'

const debounce = (func, timeout=300) => {
    let timerId;
    return (...props) => {
        clearTimeout(timerId)
        timerId = setTimeout(() => {
            func.apply(this, props)
        }, timeout);
    }
}

const Caret = forwardRef((props, ref) => <span ref={ref} {...props} className='absolute top-0 left-0 caret inline-block w-[2px] bg-black'></span>)

const TypingTest = ({ time, onDone }) => {
    const caretRef = useRef(null)
    const timerRef = useRef(null)
    const dispatch = useDispatch()
    const { lines, level, wordPosition, typedLines, currentWord, score } = useSelector(state => state)
    const [showEndModal, toggleEndModal] = useState(false)
    const [spentSeconds, setSpentSeconds] = useState(0)

    useEffect(() => {
        const words = wordsGenerator(level)
        const newLines = chunk(words, 7)
        dispatch(loadLines(newLines))
        
        toggleEndModal(false)
        setSpentSeconds(0)
    }, [level, dispatch])

    const moveCaret = debounce(() => {
        const currentWordElement = document.getElementById('currentWord')
        if (currentWordElement) {
            const rect = currentWordElement.getBoundingClientRect()
            const x = currentWordElement.innerText.length > 0 ? (rect.width * (wordPosition.cursorPos/currentWordElement.innerText.length)) : 0
            caretRef.current.style.left = `${rect.x + x}px`
            caretRef.current.style.top = `${rect.y}px`
            caretRef.current.style.height = `${rect.height}px`
            caretRef.current.style.display = 'block'
        }
    })

    useEffect(() => {
        const currentLineElement = document.getElementById('currentLine')
        if (currentLineElement) {
            currentLineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        caretRef.current.style.display = 'none'
        moveCaret()

    }, [currentWord, wordPosition])

    const listener = useCallback(event => {
        const { key } = event
        if((key.length === 1 || ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) && !showEndModal) {
            event.preventDefault()
            if (!timerRef.current.isRunning) {
                timerRef.current.start()
            }
            record(key)
        }
    }, [showEndModal])

    useEffect(() => {
        window.addEventListener('keydown', listener)
        return () => {
            window.removeEventListener('keydown', listener)
        }
    }, [listener])

    return (
        <div className='h-full w-full flex flex-col items-center font-mono'>
            <div className='flex w-full justify-center items-center p-2'>
                <Timer ref={timerRef} seconds={time} onExpired={(spentSeconds) => {
                    setSpentSeconds(spentSeconds)
                    toggleEndModal(true)
                } } />

                <button className='ml-auto border border-transparent hover:border-gray-600 px-4 py-1 rounded-lg' onClick={() => timerRef.current.stop()}>close</button>
            </div>
            <div className='w-fit flex-1 overflow-hidden text-3xl p-6 self-center'>
                {lines.map((line, lineIndex) => {
                    return (
                        <div key={`line-${lineIndex}`}>
                            <p className={`whitespace-nowrap h-14 text-gray-600 mb-2 mt-10`}>
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
                                                key={`typed-${wordIdx}-${word}`}
                                                id={lineIndex === wordPosition.lineIndex && wordIdx === wordPosition.wordIndex ? 'currentWord' : undefined}>
                                                {word}
                                            </span>
                                        )
                                    })
                                    .reduce((prev, curr) => {
                                        return [prev, ' ', curr]
                                    }, '')
                                )}
                                {!document.getElementById('currentWord') && <span className='caret inline-block w-[2px] bg-black'></span>}
                            </p>
                        </div>
                    )
                })}
            </div>

            {showEndModal && (
                <Modal>
                    <div className='p-10 w-3/5 bg-white shadow-lg flex flex-col items-center rounded'>
                        <h2 className='text-3xl text-gray-600'>{spentSeconds === time ? 'Your time is up' : 'You gave up'}!</h2>
                        <button
                            className="transition px-4 py-1 mt-10 bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/75 text-white rounded-lg"
                            onClick={() => {
                            if(typeof onDone === 'function') onDone(spentSeconds)
                        }}>View Result</button>
                    </div>
                </Modal>
            )}
            <Caret ref={caretRef} />
        </div>
      )
}

export default TypingTest