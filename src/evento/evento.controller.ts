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
  UseInterceptors,
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EventoDto } from './dto/evento.dto';
import { EventoService } from './evento.service';
import { EventoEntity } from './model/evento.entity';
import { EventoDeportistaDto } from './dto/evento-deportista.dto';
import { EventoDeportistaEntity } from './model/evento-deportista.entity';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout, TimeoutError } from 'rxjs';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';


@UseInterceptors(BusinessErrorsInterceptor)
@Controller('evento')
export class EventoController {
  constructor(
    private readonly eventoService: EventoService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    @Inject('USER_MS')
    private clienteUsuarioService: ClientProxy,
    @Inject('MS_CATALOGO_SERVICE')
    private clienteCatalogoService: ClientProxy,
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
    const eventoDeportistaEntity: EventoDeportistaEntity = plainToInstance(
      EventoDeportistaEntity,
      EventoDeportistaDto
    );
    await this.validarDeportista(idDeportista);
    return await this.eventoService.registrarDeportistaEvento(idEvento, idDeportista, eventoDeportistaEntity);
  }

  //@UseGuards(AuthGuard)
  @Get("sugerencias")
  async getSugerenciasEventos() {
    return await this.eventoService.getSugerenciasEventos();
  }

  //@UseGuards(AuthGuard)
  @Get()
  async getAllEventos() {
    return await this.eventoService.getAllEventos();
  }

  //@UseGuards(AuthGuard)
  @Get(':idEvento')
  async findEventoById(@Param('idEvento') idEvento: number) {
    return await this.eventoService.findEventoById(idEvento);
  }

  //@UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() eventoDto: EventoDto,
  ) {
    const eventoEntity: EventoEntity = plainToInstance(
      EventoEntity,
      eventoDto,
    );
    await this.validarEvento(eventoEntity);
    return await this.eventoService.create(eventoEntity);
  }

  //@UseGuards(AuthGuard)
  @Put(':idEvento')
  async update(
    @Param('idEvento') idEvento: number,
    @Body() eventoDto: EventoDto,
  ) {
    const eventoEntity: EventoEntity = plainToInstance(
      EventoEntity,
      eventoDto,
    );
    await this.validarEvento(eventoEntity);
    return await this.eventoService.update(
      idEvento,
      eventoEntity
    );
  }

  //@UseGuards(AuthGuard)
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

  private async validarEvento(evento: EventoEntity) {
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
