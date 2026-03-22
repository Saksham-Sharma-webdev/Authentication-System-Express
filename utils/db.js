import mongoose from "mongoose"

const db = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Successfully connected to db...")
  }catch(err){
    console.log("Failed to connect...")
    console.log("Error: ",err)
  }
}

export default db