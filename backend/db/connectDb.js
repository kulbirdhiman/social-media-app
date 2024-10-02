import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`database conneted succeessfly `);
  } catch (error) {
    console.log(error);
  }
};
export default connectDb;
