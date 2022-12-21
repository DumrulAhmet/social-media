import { InstallServerConfig } from "./serverConfig.js";
import { postgresConfig } from "./postgresConfig.js";
import { AuthConfig } from './authConfig.js'
import { passportConfig } from './passport.js'
import {  redisClient } from './redisConfig.js'
InstallServerConfig()
export const Config = {
    postgresConfig, InstallServerConfig,
    AuthConfig, passportConfig,
    Redis: {
    redisClient
    }
}