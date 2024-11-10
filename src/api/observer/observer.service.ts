import { Injectable, NotFoundException } from '@nestjs/common';

import {
  CreateObserverDto,
  ObserverDto,
  UpdateObserverDto,
} from '@/api/observer/observer.schema';
import { DatabaseService } from '@/services/database/database.service';

/**
 * Service responsible for managing observers in the system.
 * This includes CRUD operations for creating, retrieving, updating, and deleting observers.
 */
@Injectable()
export class ObserverService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Creates a new observer record.
   *
   * @param createObserverDto - Data transfer object containing the details for the new observer.
   * @returns A promise that resolves to the created observer data.
   * @throws {NotFoundException} If the observer cannot be created.
   */
  async create(createObserverDto: CreateObserverDto): Promise<ObserverDto> {
    const observer = await this.db.create('observer', {
      ...createObserverDto,
      isActive: true,
    });

    return observer;
  }

  /**
   * Retrieves a single observer by its unique identifier.
   *
   * @param uuid - The unique identifier of the observer to be retrieved.
   * @returns A promise that resolves to the observer data.
   * @throws {NotFoundException} If no observer is found with the given UUID.
   */
  async findOne(uuid: string): Promise<ObserverDto> {
    const observer = await this.db.findOne(
      'observer',
      (item) => item.uuid === uuid,
    );

    if (!observer) {
      throw new NotFoundException(`Observer with uuid ${uuid} not found.`);
    }

    return observer;
  }

  /**
   * Retrieves all observers in the system.
   *
   * @returns A promise that resolves to an array of observer data.
   */
  async findAll(): Promise<ObserverDto[]> {
    return this.db.findAll('observer');
  }

  /**
   * Updates an existing observer's data.
   *
   * @param uuid - The unique identifier of the observer to be updated.
   * @param updateObserverDto - Data transfer object containing the updated observer details.
   * @returns A promise that resolves to the updated observer data.
   * @throws {NotFoundException} If no observer is found with the given UUID.
   */
  async update(
    uuid: string,
    updateObserverDto: UpdateObserverDto,
  ): Promise<ObserverDto> {
    const observer = await this.db.updateOne(
      'observer',
      (item) => item.uuid === uuid,
      updateObserverDto,
    );

    if (!observer) {
      throw new NotFoundException(`Observer with uuid ${uuid} not found.`);
    }

    return observer;
  }

  /**
   * Deletes an observer by its unique identifier.
   *
   * @param uuid - The unique identifier of the observer to be deleted.
   * @returns A promise that resolves to the deleted observer data.
   * @throws {NotFoundException} If no observer is found with the given UUID.
   */
  async delete(uuid: string): Promise<ObserverDto> {
    const observer = await this.db.deleteOne(
      'observer',
      (item) => item.uuid === uuid,
    );

    if (!observer) {
      throw new NotFoundException(`Observer with uuid ${uuid} not found.`);
    }

    return observer;
  }
}
