import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { readFile, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 } from 'uuid';

import {
  Database,
  DatabaseConfig,
  DatabaseRecord,
  DatabaseTable,
} from '@/config/database';

export type QueryCondition<T extends DatabaseTable> = (
  item: DatabaseRecord<T>,
  index: number,
  obj: DatabaseRecord<T>[],
) => boolean;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private filePath = join(process.cwd(), 'database', 'db.json');

  private data: Database = {
    observer: [],
  };

  async onModuleInit() {
    await this.init();
  }

  async onModuleDestroy() {
    await this.saveData();
  }

  public async create<T extends DatabaseTable>(
    table: T,
    record: Omit<DatabaseRecord<T>, 'uuid'>,
  ): Promise<DatabaseRecord<T>> {
    const schema = DatabaseConfig[table];

    const validatedRecord = schema.parse({
      uuid: v4(),
      ...record,
    });

    this.data[table].push(validatedRecord);

    await this.saveData();

    return validatedRecord as Readonly<DatabaseRecord<T>>;
  }

  public findAll<T extends DatabaseTable>(table: T): DatabaseRecord<T>[] {
    return this.data[table];
  }

  public findOne<T extends DatabaseTable>(
    table: T,
    condition: QueryCondition<T>,
  ): DatabaseRecord<T> | null {
    return this.data[table].find(condition) ?? null;
  }

  public findMany<T extends DatabaseTable>(
    table: T,
    condition: QueryCondition<T>,
  ): DatabaseRecord<T>[] {
    return this.data[table].filter(condition);
  }

  public async updateOne<T extends DatabaseTable>(
    table: T,
    condition: QueryCondition<T>,
    update: Partial<DatabaseRecord<T>>,
  ): Promise<DatabaseRecord<T> | null> {
    const index = this.data[table].findIndex(condition);

    if (index === -1) {
      return null;
    }

    const old = this.data[table][index];

    const validated = DatabaseConfig[table].parse({
      ...old,
      ...update,
    });

    this.data[table][index] = validated;

    await this.saveData();

    return this.data[table][index] ?? null;
  }

  public async deleteOne<T extends DatabaseTable>(
    table: T,
    condition: (
      item: DatabaseRecord<T>,
      index: number,
      obj: DatabaseRecord<T>[],
    ) => boolean,
  ): Promise<DatabaseRecord<T> | null> {
    const index = this.data[table].findIndex(condition);

    if (index === -1) {
      return null;
    }

    const [deleted] = this.data[table].splice(index, 1);

    await this.saveData();

    return deleted ?? null;
  }

  private async init() {
    try {
      const dbFile = await stat(this.filePath).catch(() => null);

      if (dbFile && dbFile.isFile()) {
        const file = await readFile(this.filePath, 'utf-8');

        this.data = <Database>JSON.parse(file);
      } else {
        await this.saveData();
      }
    } catch (error) {
      Logger.error('Failed to initialize database', error, 'DatabaseService');

      await this.saveData();
    }
  }

  private async saveData() {
    await writeFile(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }
}
