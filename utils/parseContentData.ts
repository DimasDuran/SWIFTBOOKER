interface ContentData {
    id:string,
    [key:string]: any;
}

export default function parseContentDta(data: Record<string,any>): ContentData[]{
   return Object.keys(data).map((key) => ({
    id:key,
    ...data[key]
   }))
}