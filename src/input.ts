import { pipe, replace, split, map, reject, zipObj, addIndex, test } from "ramda";
import { readFileSync } from "fs";
import { forcingStringType } from "./lib";

/*
 * 準備輸入的檔案
 */


export const utf8ReadFileSync = (path: string) => readFileSync(path, {encoding: 'utf-8'})


// 在字串陣列的最前面 append 他的 index，在這裏用來把行數加入資料中，之後的 function 就可以給出有行數的錯誤提示
const mapAddIndexNumber = addIndex(map)((val, idx): string => idx + 1 + '!@@@###!' + val)


export const strutureInput = pipe(
    split('\n'),
    mapAddIndexNumber,
    map(forcingStringType), // 強迫 type 正確，@types/ramda['addIndex'] 的 type 沒有定義完全??
    reject(test(/\d+!@@@###!$/)),
    map(
        pipe(
            replace(/\s|>/g, ''),
            split(/!@@@###!|</),
            ([x, ...y]) => [+x, ...y],
            zipObj(['lineNumber', 'regex', 'token']),
        )
    )
)