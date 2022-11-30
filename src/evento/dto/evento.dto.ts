import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EventoDto {
  @IsNumber()
  idEvento: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsDate()
  fechaInicio: Date;

  @IsDate()
  fechaFin: Date;

  @IsString()
  comida: string;

  @IsString()
  estadia: string;

  @IsString()
  imagen: string;

  @IsNumber()
  @IsNotEmpty()
  idDeporte: number;

}
