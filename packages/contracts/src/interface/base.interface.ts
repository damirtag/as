export interface IBaseEntity {
  id: string;
  createdAt: Date;
}

export interface ITimestampedEntity extends IBaseEntity {
  updatedAt: Date;
}
