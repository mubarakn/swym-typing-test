import ToggleButtons from "./ToggleButtons"
import { useDispatch, useSelector } from 'react-redux'
import { setLevel } from '../reducers/levelReducer'

const StartScreen = ({ time, setTime, onStart}) => {
    const dispatch = useDispatch()
    const { level } = useSelector(state => state)

    const times = { '10 secs': 10, '1 minute': 60, '2 minutes': 120, '3 minutes': 180, '5 minutes': 300 }

    return (
        <div className="w-full shrink-0 bg-white flex flex-col items-center justify-center">
            <h1 className="text-3xl text-gray-600 mb-10">Typing Test App</h1>
            <div>
                <label className="block text-xl text-center text-gray-600">Select Difficulty</label>
                <ToggleButtons
                    containerClass='rounded mt-4'
                    activeClass='bg-emerald-500 text-white font-semibold'
                    borderColorClass='border-emerald-500'
                    keys={['Easy', 'Medium', 'Hard']}
                    values={['Easy', 'Medium', 'Hard']}
                    value={level}
                    onChange={value => { dispatch(setLevel(value)) }}
                    disabled={false}
                    />
            </div>
            <div className="mt-8">
                <label className="block text-xl text-center text-gray-600">Select Time</label>
                <ToggleButtons
                    containerClass='rounded mt-4'
                    activeClass='bg-emerald-500 text-white font-semibold'
                    borderColorClass='border-emerald-500'
                    keys={Object.keys(times)}
                    values={Object.values(times)}
                    value={time}
                    onChange={value => { setTime(value) }}
                    disabled={false}
                    />
            </div>
            <button
                className="transition px-4 py-1 mt-10 bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/75 text-white rounded-lg disabled:bg-gray-500 disabled:shadow-none disabled:opacity-50"
                onClick={() => typeof onStart === 'function' && onStart()}
                disabled={!level || !time}
                >
                Start
            </button>
        </div>
    )
}

export default StartScreen