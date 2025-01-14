import mongoose from "mongoose";

const DBCon = async() => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log('Mongodb is connected')
    } catch (error) {
        console.log('mongodb error',error)
    }
}

export default DBCon