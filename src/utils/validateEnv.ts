import { cleanEnv, str, num, port, email, url } from 'envalid';

/**
 * validateEnv is a function that validates and cleans the environment variables using the Envalid
 * library. It defines the expected types and formats for each environment variable, and throws an
 * error if any of the variables are missing or have an invalid format.
 *
 * @returns {void} - Returns nothing
 */
function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    INSTANCE_NUMBER: num(),
    TOKEN_SECRET: str(),
    API_MANAGER_EMAIL: email(),
    POINTS_LIMIT: num(),
    TIME_ZONE: str(),
    HOUSES: str(),
    STATUS_EMAIL: email(),
    STATUS_EMAIL_PASSWORD: str(),
    DATABASE_URI: url(),
    SQL_HOST: str(),
    SQL_USER: str(),
    SQL_PASSWORD: str(),
    SQL_PORT: str(),
    SQL_DATABASE_NAME: str(),
    SQL_TABLENAME: str(),
  });
}

export default validateEnv;
