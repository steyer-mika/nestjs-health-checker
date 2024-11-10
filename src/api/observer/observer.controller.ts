import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import {
  CreateObserverDto,
  ObserverDto,
  UpdateObserverDto,
} from '@/api/observer/observer.schema';
import { ObserverService } from '@/api/observer/observer.service';

/**
 * Controller responsible for handling HTTP requests related to observers.
 * It provides endpoints for creating, retrieving, updating, and deleting observers.
 */
@Controller('observer')
export class ObserverController {
  constructor(private readonly observerService: ObserverService) {}

  /**
   * Endpoint to create a new observer.
   *
   * @param createObserverDto - Data transfer object containing the details for the new observer.
   * @returns A promise that resolves to the created observer data.
   */
  @Post()
  async create(
    @Body() createObserverDto: CreateObserverDto,
  ): Promise<ObserverDto> {
    return this.observerService.create(createObserverDto);
  }

  /**
   * Endpoint to retrieve all observers in the system.
   *
   * @returns A promise that resolves to an array of observer data.
   */
  @Get()
  async findAll(): Promise<ObserverDto[]> {
    return this.observerService.findAll();
  }

  /**
   * Endpoint to retrieve an observer by its unique identifier.
   *
   * @param uuid - The unique identifier of the observer to be retrieved.
   * @returns A promise that resolves to the observer data.
   * @throws {NotFoundException} If no observer is found with the given UUID.
   */
  @Get(':uuid')
  async findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<ObserverDto> {
    return this.observerService.findOne(uuid);
  }

  /**
   * Endpoint to update an existing observer's data.
   *
   * @param uuid - The unique identifier of the observer to be updated.
   * @param updateObserverDto - Data transfer object containing the updated observer details.
   * @returns A promise that resolves to the updated observer data.
   * @throws {NotFoundException} If no observer is found with the given UUID.
   */
  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateObserverDto: UpdateObserverDto,
  ): Promise<ObserverDto> {
    return this.observerService.update(uuid, updateObserverDto);
  }

  /**
   * Endpoint to delete an observer by its unique identifier.
   *
   * @param uuid - The unique identifier of the observer to be deleted.
   * @returns A promise that resolves to the deleted observer data.
   * @throws {NotFoundException} If no observer is found with the given UUID.
   */
  @Delete(':uuid')
  async delete(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<ObserverDto> {
    return this.observerService.delete(uuid);
  }
}
