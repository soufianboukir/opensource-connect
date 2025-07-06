import mongoose from "mongoose";

const dbUrl = process.env.MONGO_URL || '';

export const dbConnection = async () =>{
    try{
        await mongoose.connect(dbUrl)
    }catch(error){
        console.log(error);
        console.log('failed to connect to db');
    }
}