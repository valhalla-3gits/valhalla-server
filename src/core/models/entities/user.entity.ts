import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserStatus } from './userStatus.entity';
import { Rank } from './rank.entity';
import { Task } from './task.entity';
import { NonAttribute } from 'sequelize';
import { FavouriteTask } from './favouriteTask.entity';

export enum UserRoleEnum {
  USER = 0,
  ADMIN = 1,
}

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare token: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
  })
  declare firstname: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
  })
  declare lastname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare experience: number;

  @ForeignKey(() => UserStatus)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare statusId: number;

  @BelongsTo(() => UserStatus)
  declare status: UserStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare role: UserRoleEnum;

  @ForeignKey(() => Rank)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare rankId: number;

  @BelongsTo(() => Rank)
  declare rank: Rank;

  @HasMany(() => Task)
  declare tasks?: NonAttribute<Task[]>;

  @BelongsToMany(() => Task, () => FavouriteTask)
  declare favouriteTasks?: Task[];
}
