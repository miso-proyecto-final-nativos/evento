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

  @UseGuards(AuthGuard)
  @Get(':idEvento')
  async findEventoById(@Param('idEvento') idEvento: number) {
    return await this.eventoService.findEventoById(idEvento);
  }

  // @UseGuards(AuthGuard)
  @Post()
  async create(
    @Param('idEvento') idEvento: number,
    @Body() eventoDto: EventoDto,
  ) {
    await this.validarEvento(eventoDto);
    eventoDto.idEvento = idEvento;
    const eventoEntity: EventoEntity = plainToInstance(
      EventoEntity,
      eventoDto,
    );
    return await this.eventoService.create(eventoEntity);
  }

  //@UseGuards(AuthGuard)
  @Put(':idEvento')
  async update(
    @Param('idEvento') idEvento: number,
    @Body() eventoDto: EventoDto,
  ) {
    await this.validarEvento(eventoDto);
    eventoDto.idEvento = idEvento;
    const eventoEntity: EventoEntity = plainToInstance(
      EventoEntity,
      eventoDto,
    );
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
