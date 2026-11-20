import mongoose from "mongoose";
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

export default async function connectToDB(){
    try {
        const mongooseConnection = await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB Connected', mongooseConnection.connection.name);
        
    } catch (err) {
        console.error('Connection Error:', err.message);
        
    }
}