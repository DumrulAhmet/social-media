import { InstallServerConfig } from "./serverConfig.js";
InstallServerConfig()

export const postgresConfig =  {
    'postgres_db_host':process.env.POSTGRES_DB_HOST,
    'postgres_db_db_name':process.env.POSTGRES_DB_DB_NAME,
    'postgres_db_password':process.env.POSTGRES_DB_PASSWORD,
    'postgres_db_username':process.env.POSTGRES_DB_USERNAME
}