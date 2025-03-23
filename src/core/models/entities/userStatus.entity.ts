import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class UserStatus extends Model<UserStatus> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(32),
    allowNull: false,
    unique: true,
  })
  declare name: string;
}
