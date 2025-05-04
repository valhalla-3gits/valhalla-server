import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task } from './task.entity';

@Table
export class Test extends Model<Test> {
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
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare test: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare test_header: string;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare task_id: number;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
  })
  declare test_result: string;

  @BelongsTo(() => Task)
  declare task: Task;
}
