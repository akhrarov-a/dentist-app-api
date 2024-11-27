import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { paginate, Status } from '@core';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  DeleteByIdsDto,
  GetServicesFilterDto,
  GetServicesResponseDto,
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
      .leftJoinAndSelect('service.user', 'user')
      .andWhere(`user.id = :userId`, { userId: user.id })
      .andWhere(`service.status = :status`, { status: Status.ACTIVE });

    Object.entries(filterDto).forEach(([key, value]) => {
      if (!value) return;

      query.andWhere(`service.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    });

    const { totalAmount, totalPages, data } = await paginate<ServiceEntity>({
      query,
      page,
      perPage,
    });

    const response: GetServicesResponseDto = {
      data,
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

  async getServiceById(id: number, user: UserEntity): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOneBy({
      id,
      user: { id: user.id },
      status: Status.ACTIVE,
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
