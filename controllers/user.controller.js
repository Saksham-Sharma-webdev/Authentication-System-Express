import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../model/User.model.js";

import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation.js";

import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/verify.email.js";

const registerUser = async (req, res) => {
  // take input name, email, password
  // validate them
  // check if user already exist
  // create a verification token and hash it
  // set the verificationtoken expiry
  // create user with its detail
  // send the verificationToken throuh email
  
  try {
    console.log("Registration started...");
    const { name, email, password } = req.body;
    const validationError =
      validateName(name) || validateEmail(email) || validatePassword(password);
    if (validationError) {
      console.log("validation failed: ", validationError);
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const verificationToken = crypto.randomBytes(64).toString("hex");

    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationTokenExpiry = Date.now() + 2 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password,
      verificationToken: hashedVerificationToken,
      verificationTokenExpiry,
    });

    await user.save();

    console.log(user);

    console.log("User created and registered successfully.");

    try {
      const emailInfo = await sendVerificationEmail(
        user.email,
        verificationToken,
      );

      if (!emailInfo) {
        console.log("verification email failed.");
        return res.status(400).json({
          success: false,
          message: "Verification email failed.",
        });
      }

    } catch (err) {
      console.log(
        "User registered successfully. But verification email failed",
      );
      return res.status(400).json({
        success: false,
        message: "User registered successfully. But verification email failed",
        error: err.message,
      });
    }
    console.log("User verification email sent succssfully. Check email.");
    return res.status(200).json({
      success: true,
      message:
        "User registered successfully. Check your email for verification.",
    });
  } catch (err) {
    console.log("Internal Server Error. User Registration failed");
    return res.status(400).json({
      success: false,
      message: "Internal Server Error. User Registration failed",
      error: err.message,
    });
  }
};

const verifyUser = async (req, res) => {
  // take token from the params
  // validate token
  // hash the token
  // find the user based on the hashedToken
  // check if user exist
  // check if it is not already verified
  // check verification token expiry
  // if expired make the token and expiry field undefined
  // if found do isverified true in it

  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    console.log(typeof verificationToken);
    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    console.log("This is hashed verification token");
    console.log(hashedVerificationToken);
    const user = await User.findOne({
      verificationToken: hashedVerificationToken,
    });
    if (!user) {
      console.log("USer doesnt exists.");
      return res.status(400).json({
        success: false,
        message: "User doesnt exist.",
      });
    }
    console.log("User found.");
    if (user.isVerified) {
      console.log("USer already exists.");
      return res.status(400).json({
        success: false,
        message: "User already verified.",
      });
    }
    if (user.verificationTokenExpiry < Date.now()) {
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      console.log("Verification token expired");
      return res.status(400).json({
        success: false,
        message: "Token has been expired. Try again.",
      });
    }
    console.log("Verification token valid");
    user.isVerified = true;
    await user.save();
    console.log("User verified successfully.");
    return res.status(200).json({
      success: true,
      message: "User verified successfully.",
    });
  } catch (err) {
    console.log("Internal server error. Verification failed");
    return res.status(400).json({
      success: true,
      message: "Internal Server Error. Verification email failed",
      error: err.message,
    });
  }
};

const resendVerifyToken = async (req, res) => {
  // take password and email from body
  // validate them
  // find user
  // if exist match password
  // check if is verified
  // create a new verification token and hash it
  // verification token expiry 2 min
  // send the verification token to user through email

  //
  try {
    const { email, password } = req.body;
    const validationError = validateEmail(email) || validatePassword(password);
    if (validationError) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
        error: validationError,
      });
    }
    const user = await User.findOne({
      email,
    });
    if (!user) {
      console.log("User not exist.");
      return res.status(404).json({
        success: false,
        message: "Unauthorised access.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("password not matched.");
      return res.status(404).json({
        success: false,
        message: "Unauthorised access.",
      });
    }
    if (user.isVerified) {
      console.log("User already verified.");
      return res.status(400).json({
        success: false,
        message: "User already verified.",
      });
    }
    const verificationToken = crypto.randomBytes(64).toString("hex");

    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationTokenExpiry = Date.now() + 2 * 60 * 1000;

    user.verificationToken = hashedVerificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    try {
      const emailInfo = await sendVerificationEmail(
        user.email,
        verificationToken,
      );

      if (!emailInfo) {
        console.log("verification email failed.");
        return res.status(400).json({
          success: false,
          message: "Verification email failed.",
        });
      }

      console.log("Email info", emailInfo.id);
      console.log("Email Sent successfully");
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Verification email failed",
        error: err.message,
      });
    }
    console.log("Verification email sent Check email.");
    return res.status(200).json({
      success: true,
      message: "Verification email sent. Check your email.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Verification email failed.",
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  // take email and passwrod from body
  // validate them
  // find user based on email
  // check if he is verified
  // if found match the password
  // check if it is verified
  // create a jwt token access token and add payload to it and then sign it
  // create a jwt refreshtoken and save it to the user
  // save the token in the cookies

  try {
    const { email, password } = req.body;

    const validationError = validateEmail(email) || validatePassword(password);
    if (validationError) {
      console.log("Validation error: ", validationError);
      return res.status(400).json({
        success: false,
        message: "Input credentials are not valid.",
        error: validationError,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User doesnt exist.",
      });
    }
    console.log("User found.");

    if (!user.isVerified) {
      console.log("User not verified");
      return res.status(400).json({
        success: false,
        message: "User not verified.",
      });
    }
    console.log("User is Verified");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch.");
      return res.status(404).json({
        success: falsee,
        message: "Password doesn't match",
      });
    }
    console.log("Password matches");

    const payload = {
      id: user._id,
      isVerified: user.isVerified,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
    });
    if(!accessToken){
      console.log("accessToken not created successfully")
      return res.status(400).json({
        success: false,
        message: "Token creation failed."
      })
    }

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN, // '120'-> ms, 120-> s, '2m', '5s', '1h', '1d' 
      },
    );
    if(!refreshToken){
      console.log("refreshToken not created successfully")
      return res.status(400).json({
        success: false,
        message: "Token creation failed."
      })
    }

    user.refreshToken = refreshToken
    await user.save()
    console.log("Refresh token saved in db")

    const cookieOption1 = {
      httpOnly: true,
      secure: true,
      maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE), // in ms
    };

    const cookieOption2 = {
      httpOnly: true,
      secure: true,
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE), // in ms
    };

    res.cookie("accessToken", accessToken, cookieOption1);
    res.cookie("refreshToken", refreshToken, cookieOption2);

    console.log("User logged In. access and refresh tokens saved");

    return res.status(200).json({
      success: true,
      message: "LogIn successfull. Tokens Saved",
    });
  } catch (err) {
    console.log("Internal server error while logging in.");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getMe = async (req, res) => {
  // this is protected by isLoggedIn
  // get the decoded data and send to the user

  try {
    const decoded = req.user;
    if(!decoded){
      console.log("decoded data not found by getMe")
      return res.status(400).json({
        success: false,
        message: "User data not found."
      })
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Login Failed",
      });
    }

    const data = {
      userName: user.name,
      userEmail: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
    return res.status(200).json({
      success: true,
      message: "Welcome to the Home page.",
      data,
    });
  } catch (err) {
    console.log("Internal server Error on getMe")
    return res.status(500).json({
      success: false,
      message: "Internal Server Errror",
      error: err,
    });
  }
};

const logoutUser = async (req, res) => {
  // check user is loggedin and supplies with data
  // we find the user from db
  // make refreshtoken null in the db
  // clear cookie of accesstoken and refresh token

  try {
    const { id } = req.user;
    const user = await User.findOne({ _id: id });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({
        success: false,
        message: "User not exists",
      });
    }
    user.refreshToken = null;

    await user.save();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    console.log("Cookies cleared successfully.");

    console.log("User logged out successfully.")
    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } 
  catch (err) {
    console.log("Error in logging out user.");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Logout failed",
      error: err.message,
    });
  }
};

const forgotPasswordUser = async (req, res) => {
  // take email from body
  // validate it
  // check if user exist
  // create resetPasswordToken
  // create resetPasswordExpiry
  // save them in db
  // send user the reset token through email

  try {
    const { email } = req.body;
    const validationError = validateEmail(email);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: "Validation email failed.",
        error: validationError,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User doesnt exists");
      return res.status(404).json({
        success: false,
        message: "User doesnt exist",
      });
    }
    console.log("User exists");
    if (!user.isVerified) {
      console.log("User not verified");
      return res.status(400).json({
        success: false,
        message: "User not verified.",
      });
    }

    const resetPasswordToken = crypto.randomBytes(64).toString("hex");

    const hashedResetPasswordToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");

    const resetPasswordExpiry = Date.now() + 2 * 60 * 1000;

    user.resetPasswordExpiry = resetPasswordExpiry;
    user.resetPasswordToken = hashedResetPasswordToken;

    await user.save();
    try {
      const emailInfo = await sendResetPasswordEmail(
        user.email,
        resetPasswordToken,
      );

      if (!emailInfo) {
        console.log("verification email failed.");
        return res.status(400).json({
          success: false,
          message: "Verification email failed.",
        });
      }

      console.log("Email info", emailInfo.id);
      console.log("Email Sent successfully");
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Verification email failed",
        error: err.message,
      });
    }
    console.log("Verification email sent Check email.");
    return res.status(200).json({
      success: true,
      message: "Verification email sent. Check your email.",
    });
  } catch (err) {
    console.log("Internal server error.");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. failed to process forgot passwor.",
      error: err.message,
    });
  }
};

const resetPasswordUser = async (req, res) => {
  // take resetPasswordToken from the req.params
  // check if token exist
  // take newPassword, confirmedNewPassword from req.body
  // validate them
  // check if they match with each other
  // find user in db on basis of token
  // check if user exist or not
  // check if he is verified or not
  // check the expiry of the token
  // change the password in the db with newPassword
  // save the user

  try {
    const { resetPasswordToken } = req.params;
    if (!resetPasswordToken) {
      console.log("No token received");
      return res.status(400).json({
        success: false,
        message: "No reset password token found.",
      });
    }
    const hashedResetPasswordToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    const { newPassword, confirmedNewPassword } = req.body;
    const validationError =
      validatePassword(newPassword) || validatePassword(confirmedNewPassword);
    if (validationError) {
      console.log("Password is not valid");
      return res.status(400).json({
        success: false,
        message: "Password is not valid.",
      });
    }
    if (newPassword !== confirmedNewPassword) {
      console.log("The two passwords doesnt match");
      return res.status(400).json({
        success: false,
        message: "the two password doesnt match with each other.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: hashedResetPasswordToken,
    });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("User found");
    if (!user.isVerified) {
      console.log("User not verified");
      return res.status(400).json({
        success: false,
        message: "User not verified.",
      });
    }
    if (Date.now() > user.resetPasswordExpiry) {
      console.log("Token has been expired");
      return res.status(400).json({
        success: false,
        message: "Reset password token expired.",
      });
    }

    user.password = newPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();
    console.log("Password reset successfull.");
    return res.status(200).json({
      success: true,
      message: "Password reset successfull.",
    });
  } catch (err) {
    console.log("Internal Server Error");
    return res.status(400).json({
      success: false,
      message: "Internal Server Error. Resetting password failed",
      error: err.message,
    });
  }
};

export {
  registerUser,
  verifyUser,
  resendVerifyToken,
  loginUser,
  getMe,
  logoutUser,
  forgotPasswordUser,
  resetPasswordUser,
};
