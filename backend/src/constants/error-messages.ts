export const ErrorMessages={
  MONGO_URI_NOT_DEFINED:"MONGO_URI environment variable not defined",
  ACCESS_TOKEN_EXPIRY_NOT_FOUND: "Jwt access token expiry time not set in env file",
  ACCESS_TOKEN_SECRET_NOT_FOUND: "Jwt access token secret not found in env file",
  ACCESS_TOKEN_EXPIRY_INVALID: "Jwt access token expiry set in env file is invalid",
  SALT_ROUNDS_NOT_SET: "The env variable SALT_ROUNDS is not set",
  SALT_ROUNDS_INVALID: "The env variable SALT_ROUNDS is in invalid format.it should be convertable to a string,convertable to an integer within 10 and 14",
  USER_ALREADY_EXISTS: "The user already exists.",
  INVALID_CREDENTIALS: "Invalid credentials.Either email or password is wrong",
  USER_BLOCKED:"Your account is currently in inactive status.",
  EMAIL_INVALID:"Email is absent or in invalid format.",
  PASSWORD_INVALID:"Password is in invalid format.Password must contain at least 8 characters and should contain at lease one lowercase,uppercase,special character and number",
  SESSION_EXPIRED:"Your current session expired.Please login to continue.",
  INTERNAL_SERVER_ERROR:"Internal server error",
  INVALID_INPUT:"Invalid input",
  NO_FILE:"No file found in the input",
  FILE_INVALID:"File invalid",
  IMAGE_KYC_COMPLETED:"Image kyc has been completed already",
  VIDEO_KYC_COMPLETED:"Video kyc has been completed already",
  USER_NOT_FOUND:"Account not found",
}as const;

export type ErrorMessagesType=typeof ErrorMessages[ keyof typeof ErrorMessages]