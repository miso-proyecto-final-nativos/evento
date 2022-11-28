import { IsArray, IsNumber } from 'class-validator';
import { EventoDto } from './evento.dto';

export class EventoDeportistaDto {
    @IsNumber()
    id: number;

    @IsNumber()
    idDeportista: number;

    @IsNumber()
    caloriasConsumidas: number;

    @IsNumber()
    tiempoEmpelado: number;

    @IsArray()
    eventos?: EventoDto[];
}
