import { pipe, map, split, test, reduce, head } from "ramda";
import { ignoreUndefine } from "./lib";
import { infixToPostfix } from "./infixToPostfix";

/*
 * 透過 regex 建立 Nondeterministic Finite Autometa
 */

interface arrow {
    startNode: number;
    endNode: number;
    action: string;
}

const createArrow = (startNode: number, endNode: number, action: string): arrow => ({
    startNode: startNode,
    endNode: endNode,
    action: action,
})


// 用數字來命名 state，
// 這樣的資料結構隱藏表示了以下的屬性
// starting state = 0
// terminal state = nodeCount - 1
// state 的集合 = [0 .. nodeCount]
interface NFAGraph {
    graph: arrow[];
    nodeCount: number;
}


interface Accumulater {
    NFAGraph: NFAGraph[];
}

const initailState: Accumulater = {
    NFAGraph: [],
}

// 可以用 evolve 做
const addState = (inc: number) => map((arrow: arrow): arrow => ({
    ...arrow,
    startNode: arrow.startNode + inc,
    endNode: arrow.endNode + inc, 
}))

const createLambdaArrow = (x: number, y: number): arrow => createArrow(x, y, 'lambda')

const createNFAVocabulary = (action: string): NFAGraph => ({
    graph: [createArrow(0, 1, action)],
    nodeCount: 2,
})

const kleeneNFA = (x: NFAGraph): NFAGraph => ({
    graph: [
        createLambdaArrow(0, 1),
        createLambdaArrow(1, x.nodeCount + 1),
        createLambdaArrow(x.nodeCount, 1),
        createLambdaArrow(x.nodeCount, x.nodeCount + 1),
        ...addState(1)(x.graph),
    ],
    nodeCount: x.nodeCount + 2
})

const concatNFA = (x: NFAGraph, y: NFAGraph): NFAGraph => ({
    graph: [
        ...x.graph,
        createArrow(x.nodeCount - 1, x.nodeCount, 'lambda'),
        ...addState(x.nodeCount)(y.graph),
    ],
    nodeCount: x.nodeCount + y.nodeCount
})

const alterNFA = (x: NFAGraph, y: NFAGraph): NFAGraph => ({
    graph: [
        createLambdaArrow(0, 1),
        ...addState(1)(x.graph),
        createLambdaArrow(x.nodeCount, x.nodeCount + y.nodeCount + 1),

        createLambdaArrow(0, x.nodeCount + 1),
        ...addState(x.nodeCount + 1)(y.graph),
        createLambdaArrow(x.nodeCount + y.nodeCount, x.nodeCount + y.nodeCount + 1),
    ],
    nodeCount: x.nodeCount + y.nodeCount + 2
})

const reducer = (acc: Accumulater, val: string): Accumulater => {
    if(test(/[^\+\*\@]/)(val)) {
        return {
            NFAGraph: [...acc.NFAGraph, createNFAVocabulary(val)]
        }
    }
    else {
        if(acc.NFAGraph.length >= 1) {
            // unary operator
            switch(val) {
                case '*':
                    return {
                        NFAGraph: [
                            ...acc.NFAGraph.slice(0, -1),
                            kleeneNFA(acc.NFAGraph[acc.NFAGraph.length - 1])
                        ]
                    }
            }

            if(acc.NFAGraph.length >= 2) {
                // binary operator
                switch(val) {
                    case '@':
                        return {
                            NFAGraph: [
                                ...acc.NFAGraph.slice(0, -2),
                                concatNFA(
                                    acc.NFAGraph[acc.NFAGraph.length - 2],
                                    acc.NFAGraph[acc.NFAGraph.length - 1],
                                )
                            ]
                        }
                    case '+':
                        return {
                            NFAGraph: [
                                ...acc.NFAGraph.slice(0, -2),
                                alterNFA(
                                    acc.NFAGraph[acc.NFAGraph.length - 2],
                                    acc.NFAGraph[acc.NFAGraph.length - 1],
                                )
                            ]
                        }
                }
            }
            throw Error('Regex 的語法錯誤')
        }
        else {
            throw Error('Regex 的語法錯誤')
        }
    }
}

const postReduce = (x: Accumulater): NFAGraph => ignoreUndefine(head(x.NFAGraph))


export const regToNFA = (expression: string): NFAGraph => pipe(
    infixToPostfix,
    split(''),
    reduce(reducer, initailState),
    postReduce,
)(expression)