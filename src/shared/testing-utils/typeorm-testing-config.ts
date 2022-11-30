import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoDeportistaEntity } from '../../evento/model/evento-deportista.entity';
import { EventoEntity } from '../../evento/model/evento.entity';
export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [EventoEntity, EventoDeportistaEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([EventoEntity, EventoDeportistaEntity]),
];
