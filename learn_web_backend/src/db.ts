import mongoose from "mongoose";

const ConnectDB = async (url: string) => {
  await mongoose.connect(url);
  console.log("connected to db");
};

export default ConnectDB;
