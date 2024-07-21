import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Contact extends Model {
  public declare readonly id: number;
  public phoneNumber!: string | null;
  public email!: string | null;
  public linkedId!: number | null;
  public linkPrecedence!: 'primary' | 'secondary';
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
  public declare readonly deletedAt: Date | null;
}

Contact.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  linkPrecedence: {
    type: DataTypes.ENUM('primary', 'secondary'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Contact',
  paranoid: true,
  timestamps: true,
});

export default Contact;
