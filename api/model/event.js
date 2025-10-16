import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Event = sequelize.define('event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hostId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id'
    }
  }
});

export default Event