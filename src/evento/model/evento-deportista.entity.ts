import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventoEntity } from './evento.entity';

@Entity()
export class EventoDeportistaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idDeportista: number;

  @Column()
  caloriasConsumidas: number;

  @Column()
  tiempoEmpleado: number;

  @ManyToMany(() => EventoEntity, (evento) => evento.eventosDeportistas)
  eventos: EventoEntity[];
}
