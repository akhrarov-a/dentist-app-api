import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DentistGuard } from '@core';
import { GetUser } from '@users/utils';
import { UserEntity } from '@users/user.entity';
import {
  CreateServiceDto,
  CreateServiceResponseDto,
  DeleteByIdsDto,
  GetServicesFilterDto,
  GetServicesResponseDto,
  UpdateServiceByIdDto,
} from './dto';
import { ServicesService } from './services.service';
import { ServiceEntity } from './service.entity';

@Controller('services')
@ApiTags('Services')
@UseGuards(AuthGuard(), DentistGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({
    summary: 'Request for getting services',
    description: 'If you want to get services, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: GetServicesResponseDto,
  })
  @Get()
  getServices(
    @Query(ValidationPipe) filterDto: GetServicesFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<GetServicesResponseDto> {
    return this.servicesService.getServices(filterDto, user);
  }

  @ApiOperation({
    summary: 'Request for getting a service by id',
    description: 'If you want to get a service by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully get',
    type: ServiceEntity,
  })
  @Get('/:id')
  getServiceById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<ServiceEntity> {
    return this.servicesService.getServiceById(id, user);
  }

  @ApiOperation({
    summary: 'Request for creating a service',
    description: 'If you want to create a service, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully created',
    type: CreateServiceResponseDto,
  })
  @Post()
  createService(
    @Body(ValidationPipe) createServiceDto: CreateServiceDto,
    @GetUser() user: UserEntity,
  ): Promise<CreateServiceResponseDto> {
    return this.servicesService.createService(createServiceDto, user);
  }

  @ApiOperation({
    summary: 'Request for updating a service by id',
    description: 'If you want to update a service by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully updated',
  })
  @Patch('/:id')
  updateServiceById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateServiceByIdDto: UpdateServiceByIdDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.servicesService.updateServiceById(
      id,
      updateServiceByIdDto,
      user,
    );
  }

  @ApiOperation({
    summary: 'Request for deleting a service by id',
    description: 'If you want to delete a service by id, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully deleted',
  })
  @Delete('/:id')
  deleteServiceById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.servicesService.deleteServiceById(id, user);
  }

  @ApiOperation({
    summary: 'Request for deleting services by ids',
    description: 'If you want to delete services by ids, use this request',
  })
  @ApiOkResponse({
    description: 'Successfully deleted',
  })
  @Delete('/by/ids')
  deleteServicesByIds(
    @Body(ValidationPipe) deleteByIdsDto: DeleteByIdsDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.servicesService.deleteServicesByIds(deleteByIdsDto, user);
  }
}
