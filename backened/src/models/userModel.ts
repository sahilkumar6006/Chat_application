import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    image: string;
    isAdmin: boolean;
    matchPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,    
    image:  {
        type: "String",
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true
});

userSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password!);
}
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
      return next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });   
const User = mongoose.model<IUser>("User", userSchema);
export default User;
