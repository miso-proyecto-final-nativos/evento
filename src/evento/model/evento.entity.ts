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
  fecha: Date;

  @Column()
  idDeporte: number;
}
