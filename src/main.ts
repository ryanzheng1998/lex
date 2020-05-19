import { pipe, map, lensProp, view } from "ramda";
import { utf8ReadFileSync, strutureInput } from "./input";
import { regToNFA } from "./regexToNFA/regexToNfa";
import { NFAToDFA } from "./NFAToDFA/NFAToDFA";
import { idPrint } from "./lib";


/*
 * 最後 compose 完的 function
 */

const regexLens = lensProp('regex')

const main = pipe(
    utf8ReadFileSync,
    strutureInput,
    map(
        pipe(
            view(regexLens),
            regToNFA,
            NFAToDFA,
            idPrint('DFA!!!!'),
        )
    ),
    console.log
)


// main('src/test/test1.txt')
// main('src/test/test2.txt')
main('src/test/test3.txt')
// main('src/test/error1.txt')
