
export const sumarDias=(fecha:Date, dias:number)=>{
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString();
}
export const restarDias=(fecha:Date, dias:number)=>{
    fecha.setDate(fecha.getDate() - dias);
    return fecha.toISOString();
}


export const formatDate=(fecha:Date)=>{
    let today = fecha.toISOString().replace("T"," ")
    const caracter = today.indexOf(".")
    let resultado = today.slice(0,caracter)
    console.log("πππππππΌππ«πΌπ¦Ίπ§΅πππ¨",resultado);
    
    return resultado;
}