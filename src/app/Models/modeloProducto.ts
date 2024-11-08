import { Precio } from "./modeloPrecio";
import { Moneda } from "./modeloMoneda";

export class Producto {
    constructor(
        public codigo: string,
        public nombre: string,
        public descripcion: string,
        public largo: number,
        public ancho: number,
        public profundidad: number,
        public stock: number,
        public disponibilidad:number,
        public moneda: Moneda,
        public precio: Precio,
        public imagen: string,
        public nombreCategoria: string,
        public rendimiento: number,
        public sugerencia: string,
        public presentacion: string,
        public rucProveedor: string,
        public nombreProveedor: string,
        public rucFilial: string,
        public nombreFilial: string,
    ){}
}
