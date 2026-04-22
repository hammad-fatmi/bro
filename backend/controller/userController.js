import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs"
import jwt, { decode } from 'jsonwebtoken'
import verifyEmail from '../emailVerify/verifyEmail.js';
import { Session } from "../models/seccionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import multer from "multer";
import { cloudinary } from "../utils/cloudinary.js";




export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All Fields are Required'
            });
        } // Added missing brace
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        // Added missing brace
        const newuser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        const token = jwt.sign({ id: newuser._id }, process.env.SECRET_KEY, { expiresIn: '10m' });
        console.log("Email:", email);
        await verifyEmail(token, email); //send email here 
        newuser.token = token

        await newuser.save()
        return res.status(200).json({
            success: true,
            message: 'user registration successfully',
            user: newuser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message


        })

    }
}

export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(400).json({
                success: false,
                message: 'Authorization token is missing or invalid'
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration Token has expired"
                });
            }
            return res.status(400).json({
                success: false,
                message: "Token Verification Failed"
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not Found'
            });
        }

        user.token = null;
        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email Verified successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// reVerify - Resend verification email if token expired or not verified
export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // If already verified
        if (user.verified || user.isVerified) {   // depending on your field name (video uses verified or isVerified)
            return res.status(400).json({
                success: false,
                message: "User is already verified"
            });
        }

        // Generate new token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || process.env.SECRET_KEY,
            { expiresIn: '10m' }   // as used in the video
        );

        // Update user with new token
        user.token = token;
        await user.save();

        // Send verification email (using the same verifyEmail function from registration)
        await verifyEmail(token, user.email);   // or sendVerificationEmail(token, email)

        res.status(200).json({
            success: true,
            message: "Verification email sent successfully. Please check your inbox."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const exisitingUser = await User.findOne({ email });

        if (!exisitingUser) {
            return res.status(400).json({
                success: false,
                message: "User not exists"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, exisitingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials'
            });
        }

        if (exisitingUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "Verify your account then login"
            });
        }

        const accessToken = jwt.sign(
            { id: exisitingUser._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
            { id: exisitingUser._id },
            process.env.SECRET_KEY,
            { expiresIn: '3d' }
        );

        exisitingUser.isLoggedIn = true;
        await exisitingUser.save();

        const existingSession = await Session.findOne({ userId: exisitingUser._id });
        if (existingSession) {
            await Session.deleteOne({ userId: exisitingUser._id });
        }

        await Session.create({ userId: exisitingUser._id });

        return res.status(200).json({
            success: true,
            message: `Welcome back ${exisitingUser.firstName}`,
            user: exisitingUser,
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        return res.status(200).json({
            success: true,
            message: 'User logged out successFully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 mins
        user.otp = otp
        user.otpExpiry = otpExpiry

        await user.save()
        await sendOTPMail(otp, email)

        return res.status(200).json({
            success: true,
            message: 'Otp sent to email successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: 'Otp is required'
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: 'Otp is not generated or already verified'
            })
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Otp has Expired please request a new one"
            })
        }
        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: 'Otp is invalid'
            })
        }
        user.otp = null
        user.otpExpiry = null
        await user.save()
        return res.status(200).json({
            success: true,
            message: 'Otp verified successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { email } = req.params
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are Required"
            })
        }

        if (newPassword !== confirmPassword)
            return res.status(400).json({
                success: false,
                message: "password do not match"
            })
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const allUser = async (_, res) => {
    try {
        const users = await User.find()

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params; //extract userId from request params
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const loggedInUser = req.user;

        const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body;

        // Authorization check
        if (
            loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this profile"
            });
        }

        let user = await User.findById(userIdToUpdate);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        // Upload new image
        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profiles" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        // Update fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;

        // Only admin can change role
        if (loggedInUser.role === "admin" && role) {
            user.role = role;
        }

        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

