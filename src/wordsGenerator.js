import faker from "@faker-js/faker"

const easyWordFuncs = [faker.word.verb, faker.word.adjective, faker.word.verb, faker.word.preposition]
const mediumWordFuncs = [faker.hacker.phrase, faker.word.noun, faker.company.companyName, faker.commerce.product, faker.animal.cat, faker.address.cardinalDirection, faker.address.streetAddress]
const hardWordFuncs = [faker.vehicle.vehicle, faker.music.genre, faker.database.engine, faker.hacker.phrase, faker.word.noun, faker.commerce.product]

const generator = (level, wordsCount = 500) => {
    let generatorArray;
    switch (level) {
        case 'Medium':
            generatorArray = mediumWordFuncs
            break;
        case 'Hard':
            generatorArray = hardWordFuncs
            break;
        default:
            generatorArray = easyWordFuncs
            break;
    }
    const generatedWords = []
    while (generatedWords.length < wordsCount) {
        const generatorIndex = Math.floor(Math.random() * generatorArray.length)
        const generatorFunc = generatorArray[generatorIndex]
        generatedWords.push(...generatorFunc().split(' '))
    }
    return generatedWords
}

export default generator