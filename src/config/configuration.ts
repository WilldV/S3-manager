/**
 *
 * @returns A configuration object based on .env file corresponding to execution environment stage
 */
export const CONFIGURATION = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 8082,
  FILES_FOLDER: process.cwd() + '/tmp',
  AWS: {
    REGION: process.env.AWS_REGION,
    ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    SECRET_KEY: process.env.AWS_SECRET_KEY,
    BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    S3_URL: process.env.S3_URL,
  },
});
