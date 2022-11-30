import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { EventoEntity } from './model/evento.entity';
import { EventoService } from './evento.service';
import { faker } from '@faker-js/faker';
import { EventoModule } from './evento.module';
describe('EventoService', () => {
  let service: EventoService;
  let eventoRepository: Repository<EventoEntity>;
  let Ev: Repository<EventoEntity>;
  let evento: EventoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        EventoService, {
          provide: 'USER_MS', useValue: EventoModule
        },
        {
          provide: 'MS_CATALOGO_SERVICE', useValue: EventoModule
        }
      ],
    }).compile();

    service = module.get<EventoService>(EventoService);
    eventoRepository = module.get<Repository<EventoEntity>>(getRepositoryToken(EventoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    eventoRepository.clear();
    evento = await eventoRepository.save({
      descripcion: faker.lorem.text(),
      ciudad: faker.address.cityName(),
      fechaInicio: faker.date.recent(),
      fechaFin: faker.date.recent(),
      nombre: faker.company.name(),
      comida: faker.company.name(),
      estadia: faker.commerce.product(),
      imagen: faker.image.imageUrl(),
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
    expect(eventoAlmacenado.fechaInicio).toEqual(evento.fechaInicio);
    expect(eventoAlmacenado.fechaFin).toEqual(evento.fechaFin);
    expect(eventoAlmacenado.idDeporte).toEqual(evento.idDeporte);
    expect(eventoAlmacenado.idEvento).toEqual(evento.idEvento);
    expect(eventoAlmacenado.nombre).toEqual(evento.nombre);
    expect(eventoAlmacenado.comida).toEqual(evento.comida);
    expect(eventoAlmacenado.estadia).toEqual(evento.estadia);
    expect(eventoAlmacenado.imagen).toEqual(evento.imagen);
  });


  it('create debe almacenar un nuevo evento', async () => {
    let eventoNuevo: EventoEntity = {
      descripcion: faker.lorem.text(),
      ciudad: faker.address.cityName(),
      fechaInicio: faker.date.recent(),
      fechaFin: faker.date.recent(),
      nombre: faker.company.name(),
      imagen: faker.image.image(),
      comida: faker.company.name(),
      estadia: faker.commerce.product(),
      idEvento: 2,
      idDeporte: 1,
      eventosDeportistas: []
    };

    eventoNuevo = await service.create(eventoNuevo);
    expect(eventoNuevo).not.toBeNull();
    const eventoAlmacenado: EventoEntity = await service.findEventoById(eventoNuevo.idEvento);
    expect(eventoAlmacenado).not.toBeNull();
    expect(eventoAlmacenado.ciudad).toEqual(eventoNuevo.ciudad);
    expect(eventoAlmacenado.descripcion).toEqual(eventoNuevo.descripcion);
    expect(eventoAlmacenado.fechaInicio).toEqual(eventoNuevo.fechaInicio);
    expect(eventoAlmacenado.fechaFin).toEqual(eventoNuevo.fechaFin);
    expect(eventoAlmacenado.idDeporte).toEqual(eventoNuevo.idDeporte);
    expect(eventoAlmacenado.idEvento).toEqual(eventoNuevo.idEvento);
    expect(eventoAlmacenado.nombre).toEqual(eventoNuevo.nombre);
    expect(eventoAlmacenado.comida).toEqual(eventoNuevo.comida);
    expect(eventoAlmacenado.estadia).toEqual(eventoNuevo.estadia);
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
    expect(eventoActualizado.fechaInicio).toEqual(evento.fechaInicio);
    expect(eventoActualizado.fechaFin).toEqual(evento.fechaFin);
    expect(eventoActualizado.idDeporte).toEqual(evento.idDeporte);
    expect(eventoActualizado.idEvento).toEqual(evento.idEvento);
    expect(eventoActualizado.nombre).toEqual(evento.nombre);
    expect(eventoActualizado.comida).toEqual(evento.comida);
    expect(eventoActualizado.estadia).toEqual(evento.estadia);
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
