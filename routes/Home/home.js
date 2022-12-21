import {getHomeController } from "../../controller/controller.js";
import express from 'express'
const app = express()

export const getHome = app.get('/', getHomeController.getHome)