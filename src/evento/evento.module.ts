import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from '../config/configuration';
import { EventoEntity } from './model/evento.entity';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV
        }.env`,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([EventoEntity, EventoEntity]),
    TerminusModule,
  ],
  providers: [
    {
      provide: 'MS_CATALOGO_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('catalogo_microservice.host'),
            port: configService.get<number>('catalogo_microservice.port'),
          },
        }),
    },
    {
      provide: 'AUTH_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('auth_microservice.host'),
            port: configService.get<number>('auth_microservice.port'),
          },
        }),
    },
    {
      provide: 'USER_MS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('usuario_microservice.host'),
            port: configService.get<number>('usuario_microservice.port'),
          },
        }),
    },
    EventoService,
  ],
  controllers: [EventoController],
})
export class EventoModule { }
