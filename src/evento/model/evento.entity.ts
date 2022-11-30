import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventoDeportistaEntity } from './evento-deportista.entity';

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

  @JoinTable()
  @ManyToMany(() => EventoDeportistaEntity, (EventoDeportistaEntity) => EventoDeportistaEntity.eventos)
  eventosDeportistas: EventoDeportistaEntity[];
}
