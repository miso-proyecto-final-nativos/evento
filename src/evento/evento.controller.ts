import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  RequestTimeoutException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { plainToInstance } from 'class-transformer';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EventoDto } from './dto/evento.dto';
import { AuthGuard } from './guards/auth.guard';
import { EventoService } from './evento.service';
import { EventoEntity } from './model/evento.entity';
import { EventoDeportistaDto } from './dto/evento-deportista.dto';
import { EventoDeportistaEntity } from './model/evento-deportista.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('evento')
export class EventoController {
  constructor(
    @Inject('MS_CATALOGO_SERVICE') private clienteCatalogoService: ClientProxy,
    @Inject('USER_MS') private clienteUsuarioService: ClientProxy,
    private readonly eventoService: EventoService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) { }

  @Get('health')
  @HealthCheck()
  async healthCheck() {
    return this.health.check([async () => this.db.pingCheck('database')]);
  }

  //@UseGuards(AuthGuard)
  @Post(":idEvento/deportista/:idDeportista")
  async registrarDeportistaEvento(@Param('idEvento') idEvento: number,
    @Param('idDeportista') idDeportista: number,
    @Body() eventoDeportistaDto: EventoDeportistaDto) {
    await this.validarDeportista(idDeportista);
    const evento = await this.eventoService.findEventoById(idEvento);
    eventoDeportistaDto.idDeportista = idDeportista;
    eventoDeportistaDto.eventos.push(evento);
    const eventoDeportistaEntity: EventoDeportistaEntity = plainToInstance(
      EventoDeportistaEntity,
      EventoDeportistaDto
    );
    return await this.eventoService.registrarDeportistaEvento(eventoDeportistaEntity);
  }

  @UseGuards(AuthGuard)
  @Get("sugerencias")
  async getSugerenciasEventos() {
    return await this.eventoService.getSugerenciasEventos();
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllEventos() {
    return await this.eventoService.getAllEventos();
  }

  @UseGuards(AuthGuard)
  @Get(':idEvento')
  async findEventoById(@Param('idEvento') idEvento: number) {
    return await this.eventoService.findEventoById(idEvento);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() eventoDto: EventoDto,
  ) {
    await this.validarEvento(eventoDto);
    const eventoEntity: EventoEntity = plainToInstance(
      EventoEntity,
      eventoDto,
    );
    return await this.eventoService.create(eventoEntity);
  }

  @UseGuards(AuthGuard)
  @Put(':idEvento')
  async update(
    @Param('idEvento') idEvento: number,
    @Body() eventoDto: EventoDto,
  ) {
    await this.validarEvento(eventoDto);
    const eventoEntity: EventoEntity = plainToInstance(
      EventoEntity,
      eventoDto,
    );
    return await this.eventoService.update(
      idEvento,
      eventoEntity
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':idEvento')
  @HttpCode(204)
  async delete(@Param('idEvento') idEvento: number) {
    return await this.eventoService.delete(idEvento);
  }

  private async validarDeportista(idDeportista: number) {
    const deportista$ = this.clienteUsuarioService
      .send({ role: 'user', cmd: 'getById' }, { idDeportista })
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        }),
      );

    const deportista = await firstValueFrom(deportista$);

    if (!deportista) {
      throw new BusinessLogicException(
        `No se encontró un deportista con el id ${idDeportista}`,
        BusinessError.NOT_FOUND,
      );
    }
  }

  private async validarEvento(evento: EventoDto) {
    const idDeporte = evento.idDeporte;
    const deporte$ = this.clienteCatalogoService
      .send({ role: 'deporte', cmd: 'getById' }, { idDeporte })
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        }),
      );

    const deporte = await firstValueFrom(deporte$);

    if (!deporte) {
      throw new BusinessLogicException(
        `No se encontró el deporte con el id ${idDeporte}`,
        BusinessError.NOT_FOUND,
      );
    }
  }
}
