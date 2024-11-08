export class Sucursal {
    constructor(
        public id: number,
        public codigo: string,
        public nombre: string,
        public email: string,
        public fechaRegistro: string,
        public detalles: string,
        public idTelefono: number,
        public idDireccion: number,
        public rucFilial: string,
        public trabajadores: string
    ) { }
}