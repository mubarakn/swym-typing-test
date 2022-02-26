import { createStore, combineReducers } from "redux";
import linesReducer from "./reducers/linesReducer";
import levelReducer from "./reducers/levelReducer";
import wordPosReducer from './reducers/wordPosReducer'
import typedLinesReducer from "./reducers/typedLinesReducer";
import currentWordReducer from "./reducers/currentWordReducer";
import scoreReducer from "./reducers/scoreReducer";

const reducers = combineReducers({
    lines: linesReducer,
    level: levelReducer,
    wordPosition: wordPosReducer,
    typedLines: typedLinesReducer,
    currentWord: currentWordReducer,
    score: scoreReducer
})

export default createStore(reducers)