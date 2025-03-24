import { Column, DataType, Model, Table } from 'sequelize-typescript';


export enum UserRoleEnum {
  USER = 0,
  ADMIN = 1,
}

@Table
export class UserRole extends Model<UserRole> {
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
