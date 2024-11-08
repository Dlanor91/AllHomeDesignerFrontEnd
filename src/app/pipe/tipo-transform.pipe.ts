import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoTransform'
})
export class TipoTransformPipe implements PipeTransform {

  transform(tipo: string): string {
    return tipo === 'Basico' ? 'Básico' : tipo;
  }

}
