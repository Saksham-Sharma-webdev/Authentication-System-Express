import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

dotenv.config();

const isLoggedIn = async (req, res, next) => {
  try {
    console.log("User logIn started...")
    // take accesstoken and refreshtoken from req.cookies

    // if both not present say user to login again

    // if no accesstoken it means refresh token there
    // then check refreshtoken and verify it
    // if verified decode it
    // take user id from it and find the user create a new accesT and refreshT
    // create payload attach it to the accesst
    // sign both using secret key and save to cookies of user
    // allow signIn give the decoded data in the user field attached with req
    // move to next controller

    // if accesstoken present
    // then verify it take the decoded data
    // attach decoded data to the

    let { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
      console.log("1. Both tokens not present. Unauthorised access.");
      return res.status(404).json({
        success: false,
        message: "Unauthorised Access. Token not present.",
      });
    }

    if (!accessToken) {
      console.log("2. Access Token not present. But refresh token is there.");

      const refreshT = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
      );

      if (!refreshT) {
        console.log("Problem with refreshT");
      }
      console.log("Refresh token found");

      const user = await User.findOne({ _id: refreshT.id });

      if (!user) {
        console.log("User not found");
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // if user had logout(refreshT deleted from db) and refreshtoken is not expired and user try to login

      if (user.refreshToken !== refreshToken) {
        console.log("Refresh token not valid and has been changed");
        return res.status(400).json({
          success: false,
          message: "Unauthorised access. Token mismatch",
        });
      }

      const payload = {
        id: user._id,
        isVerified: user.isVerified,
      };

      const newAccessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
        },
      );
      
      if (!newAccessToken) {
        console.log("newAccessToken not created successfully");
        return res.status(400).json({
          success: false,
          message: "Token creation failed.",
        });
      }
      console.log("new access T created");

      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN, 
        },
      );
      if (!newRefreshToken) {
        console.log("newRefreshToken not created successfully");
        return res.status(400).json({
          success: false,
          message: "Token creation failed.",
        });
      }
      console.log("new refresh T created");

      user.refreshToken = newRefreshToken;

      await user.save();

      const cookieOption1 = {
        httpOnly: true,
        secure: true,
        maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
      };

      const cookieOption2 = {
        httpOnly: true,
        secure: true,
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
      };

      res.cookie("accessToken", newAccessToken, cookieOption1);
      res.cookie("refreshToken", newRefreshToken, cookieOption2);

      const data = {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
      };

      req.user = data;
      console.log("User logged in successfully 2.");
    } 
    
    
    else {
      const { accessToken } = req.cookies;

      console.log("3. access token found");

      const accessT = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY,
      );

      const user = await User.findOne({ _id: accessT.id });

      if (!user) {
        console.log("USer not found");
        return res.status(400).json({
          success: false,
          message: "Unauthorised access",
        });
      }
      console.log("User found.");

      const data = {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
      };
      req.user = data;

      console.log("User logged in successfully 3.");
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export default isLoggedIn;
