"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restarDias = exports.sumarDias = void 0;
const sumarDias = (fecha, dias) => {
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString();
};
exports.sumarDias = sumarDias;
const restarDias = (fecha, dias) => {
    fecha.setDate(fecha.getDate() - dias);
    return fecha.toISOString();
};
exports.restarDias = restarDias;
//# sourceMappingURL=fecha.js.map