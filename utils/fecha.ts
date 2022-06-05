export const sumarDias=(fecha:Date, dias:number)=>{
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString();
}
export const restarDias=(fecha:Date, dias:number)=>{
    fecha.setDate(fecha.getDate() - dias);
    return fecha.toISOString();
}