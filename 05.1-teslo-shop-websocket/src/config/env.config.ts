export const EnvConfiguration = () => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES,
    synchronize: process.env.DB_SYNCHRONIZE,
});