import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { reset as currentWordReset } from '../reducers/currentWordReducer'
import { reset as levelReset } from '../reducers/levelReducer'
import { reset as scoreReset } from '../reducers/scoreReducer'
import { reset as typedLinesReset } from '../reducers/typedLinesReducer'
import { reset as wordPosReset } from '../reducers/wordPosReducer'
import dayjs from 'dayjs'

const ResultScreen = ({ spentSeconds, onPlayAgain }) => {
    const dispatch = useDispatch()
    const { score, lines, typedLines } = useSelector(state => state)
    const { corrects, wrongs } = score

    const total = (acc, itm) => acc + itm

    const totalScore = Object.values(corrects).reduce(total, 0) - Object.values(wrongs).reduce(total, 0)

    const handlePlayAgain = () => {
        dispatch(currentWordReset())
        dispatch(levelReset())
        dispatch(scoreReset())
        dispatch(typedLinesReset())
        dispatch(wordPosReset())
        if (typeof onPlayAgain === 'function') {
            onPlayAgain()
        }
    }

    useEffect(() => {
        if (spentSeconds) {
            const currentData = {[dayjs().format('YYYY-MM-DD HH:mm:ss')]: totalScore }
            const results = localStorage.getItem('results')
            if (!results) {
                localStorage.setItem('results', JSON.stringify([currentData]))
                return
            }

            const resultData = JSON.parse(results)
            if (resultData.length < 5) {
                resultData.push(currentData)
            } else {
                resultData.shift()
                resultData.push(currentData)
            }
            localStorage.setItem('results', JSON.stringify(resultData))
        }
    }, [spentSeconds])


    const fetchLastScores = () => {
        const results = localStorage.getItem('results')
        if (!results) {
            return 'No data'
        }
        const resultData = JSON.parse(results)
        return (
            <table className='table-auto border border-gray-200'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                        <th className='p-1'>Date</th>
                        <th className='p-1'>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {resultData.map((data, dIdx) => {
                        const key = Object.keys(data)[0]
                        return (
                            <tr key={`${key}-${dIdx}`} className='odd:bg-white even:bg-gray-100'>
                                <td className='p-1 border-r border-gray-200'>{dayjs(key).format(dayjs().isSame(dayjs(key), 'day') ? 'hh:mma' : 'DD-MM-YYYY hh:mma')}</td>
                                <td className='p-1'>{data[key]}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
        )
    }

    const analyzeTrickyKeys = () => {
        const wrongIndexes = Object.keys(wrongs)
        if(!wrongIndexes.length) {
            return 'No data'
        }
        const keys = {}
        wrongIndexes.map(indexes => {
            const [lineIdx, wordIdx] = indexes.split('-')
            const word = lines[lineIdx][wordIdx]
            const typedWord = typedLines[lineIdx][wordIdx]
            let idx = 0
            while (idx < word.length) {
                if (word[idx] !== typedWord[idx]) {
                    if (!keys[word[idx]]) {
                        keys[word[idx]] = 0
                    }
                    keys[word[idx]]++
                }
                idx++
            }
        })

        return (
            <div className='h-full overflow-y-auto'>
                <table className='table-auto border border-gray-200'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                            <th className='p-1'>Key</th>
                            <th className='p-1'>Missed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(keys).sort((a, b) => {
                            return keys[b] - keys[a]
                        }).map((key, kIdx) => {
                            return (
                                <tr key={`key-${kIdx}`} className='odd:bg-white even:bg-gray-100'>
                                    <td className='p-1 border-r border-gray-200'>{key}</td>
                                    <td className='p-1 text-right'>{keys[key]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="w-full shrink-0 bg-white flex p-10">
            <div>
                <h1 className='text-center font-semibold mb-2'>Last Scores</h1>
                {fetchLastScores()}
            </div>
            <div className='flex-1 flex flex-col items-center'>
                <h1 className='mb-14 text-2xl text-gray-600'>Result</h1>
                <div className='flex'>
                    <div className='flex flex-col items-center justify-center rounded-full bg-emerald-50 w-32 h-32 shadow-lg'>
                        <div className='flex items-end'>
                            <h2 className='font-semibold text-5xl text-emerald-500'>{Object.keys(corrects).length}</h2>
                            <span className='text-sm mb-1 ml-1 font-semibold text-emerald-700'> x 10</span>
                        </div>
                        <span className='text-gray-600 text-emerald-500'>Corrects</span>
                    </div>

                    <div className='ml-10 flex flex-col items-center justify-center rounded-full bg-pink-100 w-32 h-32 shadow-lg'>
                        <div className='flex items-end'>
                            <h2 className='font-semibold text-5xl text-pink-500'>{Object.keys(wrongs).length}</h2>
                            <span className='text-sm mb-1 ml-1 font-semibold text-pink-700'> x -5</span>
                        </div>
                        <span className='text-pink-500'>Wrongs</span>
                    </div>
                </div>

                <h4 className='mt-10 text-3xl text-gray-600'>Your total score is {totalScore}</h4>

                <button
                    className='mt-10 px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 shadow-md shadow-emerald-500/75 transition'
                    onClick={handlePlayAgain}
                    >
                    Play Again
                </button>
            </div>
            <div>
                <h1 className='text-center font-semibold mb-2'>Tricky keys</h1>
                {analyzeTrickyKeys()}
            </div>
        </div>
    )
}

export default ResultScreen