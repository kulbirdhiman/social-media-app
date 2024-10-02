import mongosse from "mongoose";

const userShecma = new mongosse.Schema(
  {
    username: { type: String, required: true, unquie: true },
    email: { type: String, required: true, unquie: true },
    password: { type: String, required: true },
    profilePic: { type: String, required: true, default: "" },
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female"] },
    followers : [ {type : mongosse.Schema.Types.ObjectId , ref : "User"}],
    following : [ {type : mongosse.Schema.Types.ObjectId , ref : "User"}],
  },
  { timestamps: true }
);

const User = mongosse.model("User", userShecma);

export default User;
