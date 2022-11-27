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
  fecha: Date;

  @IsNumber()
  @IsNotEmpty()
  idDeporte: number;
}
