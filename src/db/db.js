import mongoose from "mongoose";

let isConnected = false;

const db = async () => {
  if (isConnected) {
    console.log("Already connected to db ✅");
    return;
  }
  await mongoose.connect(process.env.MONGO_URL, {
    dbName: "auth_user",
  });
  isConnected = true;
  console.log("✅ Successfully connected to db...");
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});
mongoose.connection.on("error", (err) => {
  console.log("Mongoose error: ", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

export default db;
