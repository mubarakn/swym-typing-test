import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { reset as currentWordReset } from '../reducers/currentWordReducer'
import { reset as levelReset } from '../reducers/levelReducer'
import { reset as scoreReset } from '../reducers/scoreReducer'
import { reset as typedLinesReset } from '../reducers/typedLinesReducer'
import { reset as wordPosReset } from '../reducers/wordPosReducer'
import dayjs from 'dayjs'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const BarChart = ({labels, values, title}) => {

    const data = {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        labels: labels,
        datasets: [{
            label: title,
            data: values,
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
        }

    return (
        <Bar
            data={data}
            
            />
    )
}

const wordsPerMinute = (lines, spentSeconds, wrongCount) => {
    const typedWords = lines.flat(1).length - wrongCount
    if (spentSeconds === 60) {
        return typedWords
    }
    else if (spentSeconds < 60) {
        return Math.round(typedWords * (60/spentSeconds))
    }
    else {
        return Math.round(typedWords/ (spentSeconds/60))
    }
}

const CircleCard = ({ children, bgColor}) => {
    return (
        <div className={`ml-10 flex flex-col items-center justify-center rounded-full  w-32 h-32 shadow-lg ${bgColor}`}>
            {children}
        </div>
    )
}

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

    const wpm = wordsPerMinute(typedLines, spentSeconds, Object.keys(wrongs).length)

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

        const labels = []
        const values = []

        resultData.forEach(d => {
            const k = Object.keys(d)[0]
            labels.push(dayjs(k).format('D-M-YY h:m a'))
            values.push(d[k])
        })
        

        return (
            <BarChart labels={labels} values={values} title='Last Scores' />
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

        const labels = []
        const values = []

        const sortedKeys = Object.keys(keys).sort()
        sortedKeys.forEach(key => {
            labels.push(key)
            values.push(keys[key])
        });

        return (
            <BarChart labels={labels} values={values} title='Tricky Keys' />
        )
    }

    return (
        <div className="w-full shrink-0 bg-white flex p-10 justify-center">
            
            <div className='flex-1 flex flex-col items-center'>
                <h1 className='mb-14 text-2xl text-gray-600'>Result</h1>
                <h2 className=''>Words Per Minute: {wpm} </h2>
                <div className='flex mt-4'>
                    <CircleCard bgColor='bg-emerald-50'>
                        <div className='flex items-end'>
                            <h2 className='font-semibold text-5xl text-emerald-500'>{Object.keys(corrects).length}</h2>
                            <span className='text-sm mb-1 ml-1 font-semibold text-emerald-700'> x 10</span>
                        </div>
                        <span className='text-gray-600 text-emerald-500'>Corrects</span>
                    </CircleCard>

                    <CircleCard bgColor='bg-pink-100'>
                        <div className='flex items-end'>
                            <h2 className='font-semibold text-5xl text-pink-500'>{Object.keys(wrongs).length}</h2>
                            <span className='text-sm mb-1 ml-1 font-semibold text-pink-700'> x -5</span>
                        </div>
                        <span className='text-pink-500'>Wrongs</span>
                    </CircleCard>
                </div>

                <h4 className='mt-10 text-3xl text-gray-600'>Your total score is {totalScore}</h4>

                <button
                    className='mt-10 px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 shadow-md shadow-emerald-500/75 transition'
                    onClick={handlePlayAgain}
                    >
                    Play Again
                </button>
            </div>
            <div className='flex-1 pl-10 flex flex-col h-full'>
                <div className='flex-1 mt-10'>
                    {fetchLastScores()}
                </div>
{/*                 <div className='flex-1'>
                    {analyzeTrickyKeys()}
                </div> */}
            </div>
        </div>
    )
}

export default ResultScreen