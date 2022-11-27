import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoEntity } from '../../evento/model/evento.entity';
export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [EventoEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([EventoEntity]),
];
