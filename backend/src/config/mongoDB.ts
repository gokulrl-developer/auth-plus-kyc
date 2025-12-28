import mongoose from "mongoose";
import { ErrorMessages } from "../constants/error-messages";

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error(ErrorMessages.MONGO_URI_NOT_DEFINED);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
