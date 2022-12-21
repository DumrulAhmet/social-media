import { db } from "../../db/postgres.js";
import { DataTypes } from 'sequelize'

export const Post = db.define('post',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
   description:DataTypes.STRING,
   image : {
       type:DataTypes.STRING,
       defaultValue:''
   },
   like_counter:{
        type:DataTypes.INTEGER,
        defaultValue:0
   },
   view_counter:{
       type:DataTypes.INTEGER,
       defaultValue:0
   }
    
})