import { Producto } from 'src/app/Models/modeloProducto';

export class Compra {
    constructor(
        public producto: Producto,
        public cantidad: number | null,
        public fecha: Date,
    ){}
}
