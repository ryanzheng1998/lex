import { type } from "ramda"



// side effect 用來做 debug
export const idPrint = (message: string) => (x: any): any => {
    console.log(`value: ${JSON.stringify(x, null, 2)} message: ${message} type: ${type(x)}\n\n\n`)
    return x
}


// 之後做 error 處理用
export const dispatchMissingIndexAction = <T>(x: T) => typeof(x) !== 'undefined' ? x : <T>x

// 先跳過 undefine 之後要用 dispatchMissingIndexAction 處理他
export const ignoreUndefine = (x: any) => typeof(x) !== 'undefined' ? x : <any>x

// 強迫輸出是 String
export const forcingStringType = (x: any) => <string> x

// 強迫輸出是 number
export const forcingNumberType = (x: any) => <number> x

// 強迫輸出是 Array
export const forcingArrayType = (x: any) => <Array<any>> x

// 不做檢查 type 了
export const stopGuardingTypeSafty = (x: any) => <any>x

