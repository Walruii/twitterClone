import mongoose from "mongoose";

export default async function connectMongoDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  return await mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log("server connected"));
}
