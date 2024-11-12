import mongoose from "mongoose";

export const connectDb = async () => {

    mongoose.connection.on('connected', () => {
        console.log("Mongo conectou");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)

}