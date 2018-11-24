const Joi = require("joi");

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require("dotenv").config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(["development", "production", "test", "provision"])
    .default("development"),
  PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description("JWT Secret required to sign"),
  MONGO_HOST: Joi.string()
    .required()
    .description("Mongo DB host url"),
  MONGO_PORT: Joi.number().default(27017),
  SESSION_SECRET: Joi.string()
    .required()
    .description("Secret for express-ession"),
  FB_CLIENT_ID: Joi.string().required(),
  FB_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required()
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
  sessionSecret: envVars.SESSION_SECRET,
  facebookAuth: {
    clientID: envVars.FB_CLIENT_ID,
    clientSecret: envVars.FB_CLIENT_SECRET
  },
  googleAuth: {
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET
  }
};

module.exports = config;
