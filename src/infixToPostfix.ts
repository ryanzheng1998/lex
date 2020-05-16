import { pipe, reduce, test, dropLastWhile, takeLastWhile, reverse, replace, split, join } from "ramda";

/*
 * infix to postfix 的演算法實作
 */

interface Accumulater {
    postfixString: string[];
    stack: string[];
}

const initialState: Accumulater = {
    postfixString: [],
    stack: [],
}

// 用 reducer 實作標準的 infix to postfix 演算法
const reducer = (acc: Accumulater, val: string): Accumulater => {
    if(test(/[^\+@\(\)]/)(val)) {
        return {
            ...acc,
            postfixString: [...acc.postfixString, val],
        }
    }
    else {
        switch(val) {
            case '(':
                return {
                    ...acc,
                    stack: [...acc.stack, '('],
                }
            case ')':
                return {
                    postfixString: [...acc.postfixString, ...reverse(takeLastWhile(x => x !== '(')(acc.stack))],
                    stack: [...<string[]>dropLastWhile(x => x !== '(')(acc.stack).slice(0, -1)],
                }
            case '+':
                return {
                    postfixString: [...acc.postfixString, ...reverse(takeLastWhile(x => x !== '(')(acc.stack))],
                    stack: [...<string[]>dropLastWhile(x => x !== '(')(acc.stack), '+']
                }
            case '@':
                return {
                    postfixString: [...acc.postfixString, ...reverse(takeLastWhile(x => x !== '+' && x !=='(')(acc.stack))],
                    stack: [...<string[]>dropLastWhile(x => (x !== '+' && x !== '('))(acc.stack), '@']
                }
            default:
                throw Error('reducer Error')
        }
    }
}

// 把最後 stack 剩下的東西 pop 給 postfix 得到最後的結果
const postReduce = (acc: Accumulater): string[] => [
    ...acc.postfixString,
    ...reverse(acc.stack),
]

// 這裏的 regex 應該可以寫的更好，但先用這樣，反正時間複雜度一樣。
const insertConcateSymbol = (x: string[]): string[] => 
    pipe(
        join('@'),
        replace(/@\*/g)('*'),
        replace(/@\+@/g)('+'),
        replace(/\(@/g)('('),
        replace(/@\)/g)(')'),
        split(''),
    )(x)


// 運算的順序
// 1. * => 單運算元跟在他的值後就好
// 2. @ => concate 用 ’@‘ 符號表示
// 3. +
export const infixToPostfix = (expression: string): string => pipe(
    split(''),
    insertConcateSymbol,
    reduce(reducer, initialState),
    postReduce,
    join(''),
)(expression)
