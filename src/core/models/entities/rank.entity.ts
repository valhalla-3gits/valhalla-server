import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Rank extends Model<Rank> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare token: string;

  @Column({
    type: DataType.STRING(32),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare number: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare value: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare targetValue: number;
}
