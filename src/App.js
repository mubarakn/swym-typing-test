import { useState } from "react";
import ResultScreen from "./components/ResultScreen";
import StartScreen from "./components/StartScreen";
import TypingTest from "./TypingTest";

function App() {
  const [time, setTime] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const [spentSeconds, setSpentSeconds] = useState(0)

  const handleStart = () => {
    setSlideIndex(1)
  }

  const handleDone = (spentSeconds) => {
    setSpentSeconds(spentSeconds)
    setSlideIndex(2)
  }

  const handleTime = seconds => {
    setTime(seconds)
  }

  const handlePlayAgain = () => {
    setSpentSeconds(0)
    setTime(0)
    setSlideIndex(0)
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="w-full h-[60vh] md:w-3/4 lg:w-5/6 xl:w-4/5 bg-white shadow rounded overflow-hidden flex overflow-hidden">
        <div
          className={`flex w-full h-full transition`}
          style={{ transform: `translateX(-${100 * slideIndex}%)`}}
          >
          <StartScreen time={time} setTime={handleTime} onStart={handleStart} />
          <TypingTest time={time} onDone={handleDone} />
          <ResultScreen spentSeconds={spentSeconds} onPlayAgain={handlePlayAgain} />
        </div>
      </div>
    </div>
  )
}

export default App;
