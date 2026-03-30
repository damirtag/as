import { SetMetadata } from '@nestjs/common';

export const OWNER_KEY = 'owner';

export type OwnerMetadata = {
  /**
   * Entity class (TypeORM) used for repository lookup.
   */
  entity: Function;

  /**
   * Field on the entity that points to the owner (e.g. "userId").
   */
  ownerField: string;
};

export const Owner = (entity: Function, ownerField: string) =>
  SetMetadata(OWNER_KEY, { entity, ownerField } satisfies OwnerMetadata);

