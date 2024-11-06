// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Sign up a new user
exports.signup = async (req, res) => {
  const { username, email, password, name, phone, location, address } = req.body;

  try {
    // Check if email or phone is already in use
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    
    if (existingUser) {
      // Customize error message based on which field already exists
      const message = existingUser.email === email
        ? "Email is already registered."
        : "Phone number is already registered.";
      return res.status(400).json({ message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      confirmationToken,
      name,
      phone,
      location,
      address,
      role: "user",
    });

    await newUser.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const confirmationLink = `${process.env.FRONTEND_URL}/confirm/${confirmationToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Account Confirmation",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${process.env.LOGO_URL}" alt="Logo" style="max-width: 150px;">
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center;">Welcome to Our Platform!</h2>
            <p style="color: #666; line-height: 1.6;">Hello ${name},</p>
            <p style="color: #666; line-height: 1.6;">Thank you for registering with us. Please confirm your account by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationLink}" style="background-color: #0D3356; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirm Account</a>
            </div>
            <p style="color: #666; line-height: 1.6;">If the button doesn't work, you can also click this link:</p>
            <p style="color: #666; line-height: 1.6;"><a href="${confirmationLink}">${confirmationLink}</a></p>
            <p style="color: #666; line-height: 1.6;">This link will expire in 24 hours.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `,
    });

    res.status(201).json({ message: "User created. Please confirm your email." });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
};


// Confirm user account
exports.confirmAccount = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isConfirmed = true;
    user.confirmationToken = null; // Clear confirmation token
    await user.save();

    res.json({ message: "Account confirmed successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isConfirmed)
      return res
        .status(401)
        .json({ message: "Invalid credentials or account not confirmed" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role:user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Password recovery
exports.recoverPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const recoveryToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.recoveryToken = recoveryToken;
    await user.save();

    // Send recovery email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const recoveryLink = `${process.env.FRONTEND_URL}/reset/${recoveryToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Recovery",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${process.env.LOGO_URL}" alt="Logo" style="max-width: 150px;">
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6;">Hello,</p>
            <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${recoveryLink}" style="background-color: #0D3356; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #666; line-height: 1.6;">If the button doesn't work, you can also click this link:</p>
            <p style="color: #666; line-height: 1.6;"><a href="${recoveryLink}">${recoveryLink}</a></p>
            <p style="color: #666; line-height: 1.6;">This link will expire in 1 hour.</p>
            <p style="color: #666; line-height: 1.6;">If you didn't request this password reset, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `,
    });

    res.json({ message: "Recovery email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Error recovering password", error });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user || user.recoveryToken !== token)
      return res.status(401).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.recoveryToken = null; // Clear recovery token
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
