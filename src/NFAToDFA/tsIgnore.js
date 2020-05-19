import { propEq, pipe, map, view, filter, lensProp, reject, chain } from "ramda";
import { lambdaClosure } from "./lambdaClosure";

/**
 * typescript compiler 會抱怨我使用 higher order function 作爲變數亂傳，
 * 所以又回到 js 寫這些被抱怨的 function 了～
 */


/**
 * 
 * @typedef NFAArrow {startNode: number, endNode: number, action: string}
 * @sig number -> [NFAArrow] -> [number] 
 * @param {number} state - 出發節點
 * @param {Array<NFAArrow>} graph - NFA 的 adjacency list
 * @param {Array<number>} 出發點可以到的節點
 */

export const reachableNode = (graph) => (state) =>
    pipe(
        pipe(
            propEq('startNode'), 
            filter,
        )(state), //從這個 state 可以出去的箭頭
        map(
            view(lensProp('endNode'))
        )
    )(graph)

/**
 * 
 * @typedef NFAArrow {startNode: number, endNode: number, action: string}
 * @typedef DFAArrow {stateNode: number[], endNode: number[], action: string}
 * @sig [number] -> [NFAArrow] -> DFAArrow
 * @param {Array<number>} states - 構成 Arrow 要的左邊
 * @param {Array<NFAArrow>} graph - NFA 的 adjacency list
 * @param {DFAArrow} 描述點關係的箭頭
 */

export const formDFAArrow = (graph) => (states) =>
    pipe(
        chain(reachablePath(graph)), // return: 所有可到的路徑
        reject(propEq('action')('lambda')), // return: 不是 lambda 的路徑
        map(
            (NFAArrow) => ({
                startNode: states,
                endNode: lambdaClosure(NFAArrow.endNode)(graph),
                action: NFAArrow.action,
            })
        )
    )(states)

const reachablePath = (graph) => (state) => 
    pipe(
        propEq('startNode'), 
        filter,
    )(state)(graph)
