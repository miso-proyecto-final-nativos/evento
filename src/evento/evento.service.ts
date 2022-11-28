import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { EventoEntity } from './model/evento.entity';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
  ) { }

  async getAllEventos(): Promise<EventoEntity[]> {
    const eventos: EventoEntity[] =
      await this.eventoRepository.find();
    return eventos;
  }

  async getSugerenciasEventos(): Promise<EventoEntity[]> {
    const eventos: EventoEntity[] =
      await this.eventoRepository.find();
    return eventos.filter(x => x.idEvento % getRandomInt(3) === 0)
  }

  async findEventoById(
    idEvento: number,
  ): Promise<EventoEntity> {
    const evento: EventoEntity =
      await this.eventoRepository.findOne({
        where: { idEvento: idEvento }
      });
    if (!evento)
      throw new BusinessLogicException(
        'No se encontró un evento para el id suministrado',
        BusinessError.NOT_FOUND,
      );
    return evento;
  }

  async create(
    evento: EventoEntity,
  ): Promise<EventoEntity> {
    return await this.eventoRepository.save(evento);
  }

  async update(
    idEvento: number,
    evento: EventoEntity
  ): Promise<EventoEntity> {
    evento.idEvento = idEvento;
    /*
    const persistedEvento: EventoEntity =
      await this.eventoRepository.findOne({
        where: { idEvento: idEvento }
      });
     */
    console.log(evento);
    const persistedEvento = await this.eventoRepository.preload(evento);
    if (!persistedEvento) {
      throw new BusinessLogicException(
        'No se encontró un evento con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.eventoRepository.save(persistedEvento);
  }

  async delete(idEvento: number) {
    const evento: EventoEntity =
      await this.eventoRepository.findOne({
        where: { idEvento: idEvento },
      });
    if (!evento) {
      throw new BusinessLogicException(
        'No se encontró un evento con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.eventoRepository.delete(evento);
  }
}
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

