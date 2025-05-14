import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Language extends Model<Language> {
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
    type: DataType.STRING(16),
    allowNull: false,
  })
  declare shortName: string;

  @Column({
    type: DataType.STRING(16),
    allowNull: false,
  })
  declare mainFile: string;

  @Column({
    type: DataType.STRING(32),
    allowNull: false,
  })
  declare image: string;
}
