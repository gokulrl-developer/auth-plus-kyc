import dotenv from 'dotenv'
dotenv.config()
import bcrypt from "bcrypt";
import { ErrorMessages } from "../constants/error-messages";


const getSaltRounds = (): number => {
  const value = process.env.SALT_ROUNDS;

  if (!value) {
    throw new Error(ErrorMessages.SALT_ROUNDS_NOT_SET);
  }

  const rounds = Number(value);

  if (!Number.isInteger(rounds)) {
    throw new Error(ErrorMessages.SALT_ROUNDS_INVALID);
  }

  if (rounds < 10 || rounds > 14) {
    throw new Error(ErrorMessages.SALT_ROUNDS_INVALID);
  }

  return rounds;
};

const SALT_ROUNDS = getSaltRounds();

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
