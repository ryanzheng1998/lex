import { NFAArrow } from "../types";
import { propEq, filter, lensProp, difference } from "ramda";
import { reachableNode } from "./tsIgnore";

/*
 * 用 recursion 實作 Lambda Closure
 */

interface recursionInputStruture {
    recursionCount: number; // prevent overflow
    graph: NFAArrow[]; // data
    stateStack: number[]; // status
    accumulater: number[]; // accumulater
}

const endNodeLens = lensProp('endNode')


const lambdaClosureRecursion = (x: recursionInputStruture): number[] => {
    if(x.recursionCount > 100000) {
        throw Error('Function Stack 已達到設定的最大值')
    }
    
    if(x.stateStack.length === 0) {
        return x.accumulater
    }

    const newOutNode = difference(
        reachableNode(x.graph)(x.stateStack[x.stateStack.length - 1]),
        x.accumulater   
    )

    return lambdaClosureRecursion({
        recursionCount: x.recursionCount++,
        graph: x.graph,
        stateStack: [...x.stateStack.slice(0, -1), ...<number[]>newOutNode],
        accumulater: [...x.accumulater, x.stateStack[x.stateStack.length - 1]],
    })
}

export const lambdaClosure = (state: number) => (graph: NFAArrow[]) => {

    const hasLambdaAction = propEq('action', 'lambda')
    const onlyLambdaArrowGraph = filter(hasLambdaAction)(graph)

    return lambdaClosureRecursion({
        recursionCount: 0,
        graph: onlyLambdaArrowGraph,
        stateStack: [state],
        accumulater: [],
    })

}