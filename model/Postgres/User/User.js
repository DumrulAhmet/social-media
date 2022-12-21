import { db } from "../../../db/postgres.js";
import { DataTypes } from 'sequelize'

export const User = db.define('user',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email:DataTypes.STRING,
    phone: DataTypes.STRING,
    membership_type:DataTypes.STRING,
    reference_code:{
        type:DataTypes.STRING,
        defaultValue:"0"
    },
    password:DataTypes.STRING,
    title: {
        type: DataTypes.STRING,
        defaultValue:"no title"
    },
    image: {
        type: DataTypes.STRING,
        defaultValue:"default.jpg"
    },
    solution_view_counter:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    view_counter:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    premium:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})