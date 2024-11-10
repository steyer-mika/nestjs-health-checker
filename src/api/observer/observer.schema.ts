import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ObserverSchema = z.object({
  uuid: z.string().uuid(),

  label: z.string(),
  url: z.string(),

  isActive: z.boolean(),
});

export class ObserverDto extends createZodDto(ObserverSchema) {}

export class CreateObserverDto extends createZodDto(
  ObserverSchema.omit({ uuid: true, isActive: true }),
) {}

export class UpdateObserverDto extends createZodDto(
  ObserverSchema.omit({ uuid: true }),
) {}
