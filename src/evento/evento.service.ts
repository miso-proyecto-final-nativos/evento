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
    const persistedEvento: EventoEntity =
      await this.eventoRepository.findOne({
        where: { idEvento: idEvento }
      });
    if (!persistedEvento) {
      throw new BusinessLogicException(
        'No se encontró un evento con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.eventoRepository.save({
      ...persistedEvento,
      ...evento
    });
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
