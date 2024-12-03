import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { paginate, Status } from '@core';
import { formatServiceToReturn } from './utils';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  DeleteByIdsDto,
  GetServicesFilterDto,
  GetServicesResponseDto,
  ServiceToReturnDto,
  UpdateServiceByIdDto,
} from './dto';
import { ServiceEntity } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async getServices(
    { page, perPage, ...filterDto }: GetServicesFilterDto,
    user: UserEntity,
  ): Promise<GetServicesResponseDto> {
    const query = this.serviceRepository.createQueryBuilder('service');

    query
      .andWhere(`service.user_id = :user_id`, { user_id: user.id })
      .andWhere(`service.status = :status`, { status: Status.ACTIVE });

    Object.entries(filterDto).forEach(([key, value]) => {
      if (!value) return;

      query.andWhere(`service.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    });

    query.select([
      'service.id',
      'service.name',
      'service.created_at',
      'service.updated_at',
    ]);

    const { totalAmount, totalPages, data } = await paginate<ServiceEntity>({
      query,
      page,
      perPage,
    });

    const response: GetServicesResponseDto = {
      data: data.map(formatServiceToReturn),
      totalAmount,
      totalPages,
    };

    if (page && perPage) {
      response.page = +page;
      response.perPage = +perPage;
    }

    return response;
  }

  async getServicesByIds(
    ids: number[],
    user: UserEntity,
  ): Promise<ServiceEntity[]> {
    const services = await this.serviceRepository.findBy({
      id: In(ids),
      status: Status.ACTIVE,
      user: { id: user.id },
    });

    if (!services.length) {
      throw new NotFoundException(
        `Services with ids ${ids.join(', ')} not found`,
      );
    }

    return services;
  }

  async getFormattedServiceById(
    id: number,
    user: UserEntity,
  ): Promise<ServiceToReturnDto> {
    return formatServiceToReturn(await this.getServiceById(id, user));
  }

  async getServiceById(id: number, user: UserEntity): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({
      where: {
        id,
        user: { id: user.id },
        status: Status.ACTIVE,
      },
      select: ['id', 'name'],
    });

    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }

    return service;
  }

  async createService(
    createServiceDto: CreateServiceDto,
    user: UserEntity,
  ): Promise<CreateServiceResponseDto> {
    const isServiceExistsWithThisName = await this.serviceRepository.findOneBy({
      name: createServiceDto.name,
      status: Status.ACTIVE,
    });

    if (isServiceExistsWithThisName) {
      throw new ConflictException({
        errorCode: '23505',
        message: 'Service with this name already exists',
      });
    }

    const { name } = createServiceDto;

    const service = new ServiceEntity();

    service.name = name;
    service.status = Status.ACTIVE;
    service.user = user;

    await service.save();

    return { id: service.id };
  }

  async updateServiceById(
    id: number,
    updateServiceByIdDto: UpdateServiceByIdDto,
    user: UserEntity,
  ): Promise<void> {
    const anotherServiceWithThisName = await this.serviceRepository.findOneBy({
      name: updateServiceByIdDto.name,
      status: Status.ACTIVE,
    });

    if (anotherServiceWithThisName && anotherServiceWithThisName.id !== id) {
      throw new ConflictException({
        errorCode: '23505',
        message: 'Service with this name already exists',
      });
    }

    const service = await this.getServiceById(id, user);

    Object.keys(updateServiceByIdDto).map((key) => {
      service[key] = updateServiceByIdDto[key];
    });

    await this.serviceRepository.save(service);
  }

  async deleteServiceById(id: number, user: UserEntity): Promise<void> {
    const service = await this.getServiceById(id, user);

    await this.serviceRepository.save({ ...service, status: Status.DELETED });
  }

  async deleteServicesByIds(
    deleteByIdsDto: DeleteByIdsDto,
    user: UserEntity,
  ): Promise<void> {
    const services = await this.serviceRepository.findBy({
      id: In(deleteByIdsDto.ids),
      status: Status.ACTIVE,
      user: { id: user.id },
    });

    if (!services.length) {
      throw new NotFoundException(
        `Services with ids ${deleteByIdsDto.ids.join(', ')} not found`,
      );
    }

    services.forEach((service) => {
      service.status = Status.DELETED;
    });

    await this.serviceRepository.save(services);
  }
}
