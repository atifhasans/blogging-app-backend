import UserModel from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const Register = async (req, res) => {
    try {
        const { FullName, email, password } = req.body;
        const existUser = await UserModel.findOne({ email }); // Corrected: Use findOne for a single user
        if (existUser) {
            return res.status(303).json({
                success: false,
                message: "User already exists, please login",
            });
        }
        const imagePath = req.file?.filename || null; // Handle case where req.file might be undefined
        const hashedPassword = await bcryptjs.hash(password, 10); // Fixed method call

        const NewUser = new UserModel({
            FullName,
            email,
            password: hashedPassword,
            profile: imagePath,
        });

        await NewUser.save();
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: NewUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const Login = async(req,res) => {
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        const FindUser = await UserModel.findOne({email})
        if(!FindUser) {
            return res.status(400).json({success:false,message:"No user found, please register"});
        }
        const comparePassword = await bcryptjs.compare(password,FindUser.password)
        if(!comparePassword) {
            return res.status(400).json({success:false,message:"Invalid password"});
        }
        const token = jwt.sign({userId:FindUser._id},process.env.JWT_SECRET)
        res.cookie('token',token, {
            httpOnly: true,
            secure:false,
            maxAge:3*24*60*60*1000
        })
        res.status(200).json({success:true,message:"Login successfully",user:FindUser,token})
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

const Logout = async(req,res) => {
    try {
        res.clearCookie('token')
        res.status(200).json({success:true,message:"Logout successfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

export { Register,Login,Logout };
