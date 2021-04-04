import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export const connectToDatabase = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  console.log(`Database connected: ${MONGO_URI}`);
};
