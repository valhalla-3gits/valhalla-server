import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Rank } from './rank.entity';
import { User } from './user.entity';
import { Language } from './language.entity';
import { Task } from './task.entity';

@Table
export class SolvedTask extends Model<SolvedTask> {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  declare solution: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare taskId: number;

  @BelongsTo(() => User)
  declare task: Task;
}
