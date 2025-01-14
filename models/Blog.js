import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    desc:{
        type:String,
    },
    image:{
        type:String,
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: {
        type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
        ref: "User", // Reference to the User model
        default: [],
    },
},{timestamps:true})

const PostModel = mongoose.model("Posts",PostSchema)

export default PostModel