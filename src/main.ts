import { pipe, map, over, lensProp } from "ramda";
import { utf8ReadFileSync, strutureInput } from "./input";
import { regToNFA } from "./regexToNfa";


/*
 * 最後 compose 完的 function
 */

const regexLens = lensProp('regex')

const main = pipe(
    utf8ReadFileSync,
    strutureInput,
    map(
        over(regexLens, regToNFA)
    ),
    console.log
)

main('src/test/test1.txt')
main('src/test/test2.txt')
main('src/test/test3.txt')
main('src/test/error1.txt')
