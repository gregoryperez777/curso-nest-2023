import * as Joi from 'joi';


/**
 * JOI valida las variables de entornos requeridas
 * sino existen y se le coloca valores por defectos entonces
 * las crea y asi cuando lleguen al archivo EnvConfiguration
 * ya tienen un valor
 */

export const JoiValidationSchema = Joi.object({
    DB_PASSWORD: Joi.string().required(),
    DB_HOST: Joi.string().required().default('localhost'), 
    DB_PORT: Joi.number().required().default(5432), 
    DB_NAME: Joi.string().required().default('TesloDB'), 
    DB_USERNAME: Joi.string().required().default('postgres'),
    PORT: Joi.number().required().default('postgres'),
    HOST_API: Joi.string().required()
});