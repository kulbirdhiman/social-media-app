import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : "User"},
    content : {type : String , required : true}
},{timestamps : true})
const postSchema = new mongoose.Schema({
    auther : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    image : {type : String , required : true},
    caption : {type : String , required : true  ,default : ""},
    likes : [{type : mongoose.Schema.Types.ObjectId, ref : "User"}],
    comments : [commentSchema] 

},{timestamps : true})
const Post = mongoose.model("Post",postSchema);
export default Post