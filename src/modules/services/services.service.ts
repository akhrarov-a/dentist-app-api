import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '@users/user.entity';
import { paginate } from '@core';
import {
  CreateServiceDto,
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

    query.andWhere(`service.userId = :userId`, { userId: user.id });

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

  async getServiceById(id: number, user: UserEntity): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOneBy({
      id,
      userId: user.id,
    });

    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }

    return service;
  }

  async createService(
    createServiceDto: CreateServiceDto,
    user: UserEntity,
  ): Promise<Pick<ServiceEntity, 'id'>> {
    const { name, status } = createServiceDto;

    const service = new ServiceEntity();

    service.name = name;
    service.status = status;
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
    const result = await this.serviceRepository.delete({ id, userId: user.id });

    if (!result.affected) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
  }

  async deleteServicesByIds(
    deleteByIdsDto: DeleteByIdsDto,
    user: UserEntity,
  ): Promise<void> {
    const services = await this.serviceRepository.delete({
      id: In(deleteByIdsDto.ids),
      userId: user.id,
    });

    if (!services.affected) {
      throw new NotFoundException(
        `Services with ids ${deleteByIdsDto.ids.join(', ')} not found`,
      );
    }
  }
}
