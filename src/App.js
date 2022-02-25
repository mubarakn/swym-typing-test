import { useEffect, useState } from 'react'
import faker from "@faker-js/faker"
import Master from "./components/Master";

const easyWordFuncs = [faker.word.verb, faker.word.noun, faker.word.conjunction, faker.word.adjective, faker.name.firstName, faker.animal.type]
const mediumWordFuncs = [faker.hacker.phrase, faker.word.noun, faker.company.companyName, faker.commerce.product, faker.animal.cat, faker.address.cardinalDirection, faker.address.streetAddress]
const hardWordFuncs = [faker.vehicle.vehicle, faker.music.genre, faker.database.engine, faker.hacker.phrase, faker.word.noun, faker.commerce.product, faker.phone.phoneNumber]

function App() {
  const [level, setLevel] = useState('hard') //easy, medium, hard
  const [words, setWords] = useState([])
  const [word, setWord] = useState('')

  useEffect(() => {
    const listener = event => {
      if(event.key.length === 1 || event.key === 'Tab' || event.key === 'Backspace') {
        event.preventDefault()
      }
      console.log(event)
    }
    window.addEventListener('keydown', listener)
    return () => {
      window.addEventListener('keydown', listener)
    }
  }, [])

  useEffect(() => {
    let generatorArray;
    switch (level) {
      case 'medium':
        generatorArray = mediumWordFuncs
        break;
      case 'hard':
        generatorArray = hardWordFuncs
        break;
      default:
        generatorArray = easyWordFuncs
        break;
    }

    const generatedWords = []
    while (generatedWords.length < 300) {
      const generatorIndex = Math.floor(Math.random() * generatorArray.length)
      const generatorFunc = generatorArray[generatorIndex]
      generatedWords.push(...generatorFunc().split(' ').filter(a => a.length >= 3))
    }
    setWords(generatedWords)
  }, [level])

  return (
    <Master>
      <h1>{word}</h1>
      <button onClick={() => { setWord(faker.word.adjective())}}>Generate</button>
    </Master>
  );
}

export default App;
