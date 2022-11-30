import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventoEntity {
  @PrimaryGeneratedColumn()
  idEvento: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  ciudad: string;

  @Column()
  fechaInicio: Date;

  @Column()
  fechaFin: Date;

  @Column()
  comida: string;

  @Column()
  estadia: string;

  @Column()
  imagen: string;

  @Column()
  idDeporte: number;
}
