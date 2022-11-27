// Import the envalid package
import { cleanEnv, str, num, port, email, url } from 'envalid';

// Validate the environment variables
function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    INSTANCE_NUMBER: num(),
    TOKEN_SECRET: str(),
    API_MANAGER_EMAIL: email(),
    POINTS_LIMIT: num(),
    TIME_ZONE: str(),
    PING_URL: url(),
    PING_INTERVAL: num(),
    STATUS_EMAIL: email(),
    STATUS_EMAIL_PASSWORD: str(),
    DATABASE_URI: str(),
    HOST: str(),
    USER: str(),
    PASSWORD: str(),
    SQL_PORT: port(),
    DATABASE_NAME: str(),
    TABLENAME: str(),
  });
}

// Export the validateEnv function
export default validateEnv;
