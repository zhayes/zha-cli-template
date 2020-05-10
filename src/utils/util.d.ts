
interface FormatMoneyFunc{
    (text:string):string
}
export const formatMoney:FormatMoneyFunc

interface DownloadFunc{
    (url:string, txtName:string):void
}
export const download:DownloadFunc

interface DispatchWithPromiseFunc{
    (type:any, payload?:any, data?:any):Promise<any>
}

export const dispatchWithPromise:DispatchWithPromiseFunc