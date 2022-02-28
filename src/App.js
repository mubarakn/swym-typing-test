import { useState } from "react";
import ResultScreen from "./components/ResultScreen";
import StartScreen from "./components/StartScreen";
import TypingTest from "./components/TypingTest";

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
    <>
      {slideIndex === 0 && <StartScreen time={time} setTime={handleTime} onStart={handleStart} />}
      {slideIndex === 1 && <TypingTest time={time} onDone={handleDone} />}
      {slideIndex === 2 && <ResultScreen spentSeconds={spentSeconds} onPlayAgain={handlePlayAgain} />}
    </>
  )
}

export default App;
