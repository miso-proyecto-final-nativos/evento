import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { EventoEntity } from './model/evento.entity';
import { EventoService } from './evento.service';
import { faker } from '@faker-js/faker';

describe('PerfilDeportivoService', () => {
  let service: EventoService;
  let eventoRepository: Repository<EventoEntity>;
  let evento: EventoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EventoService],
    }).compile();

    service = module.get<EventoService>(EventoService);
    eventoRepository = module.get<Repository<EventoEntity>>(
      getRepositoryToken(EventoEntity),
    );
    eventoRepository = module.get<
      Repository<EventoEntity>
    >(getRepositoryToken(EventoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    eventoRepository.clear();
    evento = await eventoRepository.save({
      descripcion: faker.lorem.text(),
      ciudad: faker.address.cityName(),
      fecha: faker.date.recent(),
      nombre: faker.company.name(),
      idEvento: 1,
      idDeporte: 1
    });
  };

  it('El servicio de evento debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findEventoById debe retornar los datos del evento a partir de un id de evento suministrado', async () => {
    const eventoAlmacenado: EventoEntity =
      await service.findEventoById(evento.idEvento);
    expect(eventoAlmacenado).not.toBeNull();
    expect(eventoAlmacenado.ciudad).toEqual(evento.ciudad);
    expect(eventoAlmacenado.descripcion).toEqual(evento.descripcion);
    expect(eventoAlmacenado.fecha).toEqual(evento.fecha);
    expect(eventoAlmacenado.idDeporte).toEqual(evento.idDeporte);
    expect(eventoAlmacenado.idEvento).toEqual(evento.idEvento);
    expect(eventoAlmacenado.nombre).toEqual(evento.nombre);
  });


  it('create debe almacenar un nuevo evento', async () => {
    let eventoNuevo: EventoEntity = {
      descripcion: faker.lorem.text(),
      ciudad: faker.address.cityName(),
      fecha: faker.date.recent(),
      nombre: faker.company.name(),
      idEvento: 2,
      idDeporte: 1
    };

    eventoNuevo = await service.create(eventoNuevo);
    expect(eventoNuevo).not.toBeNull();
    const eventoAlmacenado: EventoEntity =
      await service.findEventoById(eventoNuevo.idEvento);
    expect(eventoAlmacenado).not.toBeNull();
    expect(eventoAlmacenado.ciudad).toEqual(eventoNuevo.ciudad);
    expect(eventoAlmacenado.descripcion).toEqual(eventoNuevo.descripcion);
    expect(eventoAlmacenado.fecha).toEqual(eventoNuevo.fecha);
    expect(eventoAlmacenado.idDeporte).toEqual(eventoNuevo.idDeporte);
    expect(eventoAlmacenado.idEvento).toEqual(eventoNuevo.idEvento);
    expect(eventoAlmacenado.nombre).toEqual(eventoNuevo.nombre);
  });

  it('update debe modificar los datos de un evento', async () => {
    evento.nombre = faker.company.name();
    evento.ciudad = faker.address.cityName();
    const eventoActualizado = await service.update(
      evento.idEvento,
      evento,
    );
    expect(eventoActualizado).not.toBeNull();
    expect(eventoActualizado.ciudad).toEqual(evento.ciudad);
    expect(eventoActualizado.descripcion).toEqual(evento.descripcion);
    expect(eventoActualizado.fecha).toEqual(evento.fecha);
    expect(eventoActualizado.idDeporte).toEqual(evento.idDeporte);
    expect(eventoActualizado.idEvento).toEqual(evento.idEvento);
    expect(eventoActualizado.nombre).toEqual(evento.nombre);
  });

  it('delete debe eliminar los datos de un evento', async () => {
    await service.delete(evento.idEvento);
    await expect(() =>
      service.findEventoById(evento.idEvento),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un evento para el id suministrado',
    );
  });

});
