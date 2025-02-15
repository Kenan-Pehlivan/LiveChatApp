import mongoose from "mongoose";
import { genSalt } from "bcrypt";


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email missing."],
        unique: true,
    },

    password:{
        type:String,
        required:[true, "Password missing."],
    },

    firstName:{
        type:String,
        required:false,
    },

    LastName:{
        type:String,
        required:false,
    },
    image:{
        type: String,
        required: false,
    },
    color:{
        type: Number,
        required: false,
    },
    profileSetup:{
        type: Boolean,
        default: false,
    },
})


userSchmea.pre("save", async function(next){
    const salt = await genSalt();
    this.password=await hash(this.password, salt);
    next(); 
});

const User = mongoose.model("Users", userSchema);

export default User;