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

  @Column({ nullable: true })
  fechaInicio: Date;

  @Column({ nullable: true })
  fechaFin: Date;

  @Column({ nullable: true })
  comida: string;

  @Column({ nullable: true })
  estadia: string;

  @Column({ nullable: true })
  imagen: string;

  @Column()
  idDeporte: number;
}
