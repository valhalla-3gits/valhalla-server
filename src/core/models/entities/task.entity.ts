import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Rank } from './rank.entity';
import { User } from './user.entity';
import { Language } from './language.entity';
import { SolvedTask } from './solvedTask.entity';
import { NonAttribute } from 'sequelize';

@Table
export class Task extends Model<Task> {
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
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare tests: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare authorId: number;

  @BelongsTo(() => User)
  declare author: User;

  @ForeignKey(() => Language)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare languageId: number;

  @BelongsTo(() => Language)
  declare language: Language;

  @ForeignKey(() => Rank)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare rankId: number;

  @BelongsTo(() => Rank)
  declare rank: Rank;

  @HasMany(() => SolvedTask)
  declare solvedTasks?: NonAttribute<SolvedTask[]>;
}
