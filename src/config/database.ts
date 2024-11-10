import { z, ZodSchema } from 'zod';

import { ObserverSchema } from '@/api/observer/observer.schema';

type IdleDatabaseConfig = {
  [table: string]: ZodSchema;
};

export const DatabaseConfig = {
  observer: ObserverSchema,
} satisfies IdleDatabaseConfig;

export type DatabaseConfig = typeof DatabaseConfig;

export type DatabaseTable = keyof DatabaseConfig;

export type Database = {
  [table in DatabaseTable]: z.infer<DatabaseConfig[table]>[];
};

export type DatabaseRecord<T extends DatabaseTable> = Readonly<
  z.infer<DatabaseConfig[T]>
>;
