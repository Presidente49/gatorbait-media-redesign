declare module 'mammoth/mammoth.browser' { export function convertToHtml(input:{arrayBuffer:ArrayBuffer}):Promise<{value:string,messages:Array<{message:string,type:string}>}>; }
