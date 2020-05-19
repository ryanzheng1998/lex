import { pipe, map, over, lensProp, view, identity, prop, toUpper } from "ramda";
import { utf8ReadFileSync, strutureInput } from "./input";
import { regToNFA } from "./regexToNFA/regexToNfa";
import { NFAGraph } from "./types";
import { lambdaClosure } from "./NFAToDFA/lambdaClosure";
import { idPrint } from "./lib";
import { NFAToDFA } from "./NFAToDFA/NFAToDFA";

/*
 * 開發時讓我測試並組裝想法的區塊，跟主程式無關。
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
            idPrint('??'),
        )
    ),
    // console.log
)


main('src/test/test1.txt')
main('src/test/test2.txt')
main('src/test/test3.txt')
// main('src/test/error1.txt')

