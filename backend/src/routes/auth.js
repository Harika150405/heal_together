const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const prisma = require('../db');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SMTP Transporter setup using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP connection configuration error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

// Helper to log OTP to a local file for development convenience
function logOTPToFile(email, username, otp, type) {
  try {
    const logPath = path.join(__dirname, '../../OTP_LOG.txt');
    const logEntry = `[${new Date().toLocaleString()}] Type: ${type} | Email: ${email} | Username: ${username || 'N/A'} | OTP: ${otp}\n`;
    fs.appendFileSync(logPath, logEntry, 'utf8');
    console.log(`[OTP Log] Logged OTP to ${logPath}`);
  } catch (err) {
    console.error('[OTP Log Error] Failed to write OTP to file:', err);
  }
}

// Helper function to send email
async function sendOTPEmail(email, username, otp, subject, isReset = false) {
  const mailOptions = {
    from: `"Heal Together" <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: isReset 
      ? `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 5 minutes.</p>`
      : `<p>Hello <b>${username}</b>,<br>Your verification code is: <b>${otp}</b></p>`
  };
  return transporter.sendMail(mailOptions);
}

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, fname, lname, password, conpassword, gender, email, phone, address } = req.body;

    if (password !== conpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or Email already registered' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins validity

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-detect role for simple setup/testing
    const lowerUser = username.toLowerCase();
    const lowerEmail = email.toLowerCase();
    const role = (lowerUser.includes('admin') || lowerEmail.includes('admin')) ? 'ADMIN' : 'USER';

    // Save user with verified=false
    const newUser = await prisma.user.create({
      data: {
        username,
        fname,
        lname,
        password: hashedPassword,
        conpassword, // kept for DB column compatibility
        gender,
        email,
        phone,
        address,
        verified: false,
        otp,
        otpExpiry,
        role
      }
    });

    // Log OTP to local file as development fallback
    logOTPToFile(email, username, otp, 'REGISTRATION');

    // Send Mail
    try {
      console.log(`[OTP] Sending registration OTP to ${email}: ${otp}`);
      await sendOTPEmail(email, username, otp, 'Your OTP Verification Code');
    } catch (mailErr) {
      console.error(`[OTP Error] Failed to send registration email to ${email}:`, mailErr);
      // Even if mail fails, let client know so they can troubleshoot, but keep the record
    }

    res.status(201).json({ 
      message: 'Registration successful! OTP sent to your email.', 
      email: email,
      username: username
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. VERIFY REGISTRATION OTP
router.post('/verify-registration-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark as verified and clear OTP fields
    await prisma.user.update({
      where: { email },
      data: {
        verified: true,
        otp: null,
        otpExpiry: null
      }
    });

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid Username or Password' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Username or Password' });
    }

    // Check if verified
    if (!user.verified) {
      // Re-generate OTP and send
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { otp, otpExpiry }
      });

      // Log OTP to local file as development fallback
      logOTPToFile(user.email, user.username, otp, 'LOGIN_VERIFICATION');

      try {
        console.log(`[OTP] Sending login-verification OTP to ${user.email}: ${otp}`);
        await sendOTPEmail(user.email, user.username, otp, 'Your OTP Verification Code');
      } catch (mailErr) {
        console.error(`[OTP Error] Failed to send login-verification email to ${user.email}:`, mailErr);
      }

      return res.status(403).json({ 
        error: 'Email not verified. A new OTP has been sent to your email.', 
        notVerified: true,
        email: user.email 
      });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Google Login Endpoint
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential token is required' });
    }

    // Verify ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
    } catch (verifyErr) {
      console.error('Google ID token verification failed:', verifyErr);
      return res.status(400).json({ error: 'Invalid Google credential token' });
    }

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Auto-create user if they don't exist
      const generatedUsername = `user_${email.split('@')[0]}_${Math.floor(1000 + Math.random() * 9000)}`;
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Check if username contains admin to auto-assign admin role
      const lowerEmail = email.toLowerCase();
      const role = lowerEmail.includes('admin') ? 'ADMIN' : 'USER';

      user = await prisma.user.create({
        data: {
          username: generatedUsername,
          fname: given_name || 'Heal',
          lname: family_name || 'Member',
          password: hashedPassword,
          conpassword: randomPassword,
          gender: 'Other',
          email,
          phone: 'N/A',
          address: 'Google Sign-in Account',
          verified: true, // Google accounts are pre-verified
          role
        }
      });
      console.log(`[Google Auth] Created new user: ${generatedUsername} with role ${role}`);
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Google Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Export middleware for use in other routes
router.authenticateToken = authenticateToken;

// 4. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email not found!' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins validity

    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry
      }
    });

    // Log OTP to local file as development fallback
    logOTPToFile(email, user.username, otp, 'PASSWORD_RESET');

    try {
      console.log(`[OTP] Sending forgot-password OTP to ${email}: ${otp}`);
      await sendOTPEmail(email, user.username, otp, 'Password Reset OTP', true);
    } catch (mailErr) {
      console.error(`[OTP Error] Failed to send forgot-password email to ${email}:`, mailErr);
    }

    res.status(200).json({ message: 'OTP sent to your email!', email });
  } catch (error) {
    console.error('Forgot pass error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. VERIFY RESET OTP
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 6. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password, conpassword } = req.body;

    if (password !== conpassword) {
      return res.status(400).json({ error: 'Passwords do not match!' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired session. Please request OTP again.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        conpassword, // compatibility
        otp: null,
        otpExpiry: null
      }
    });

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 7. GET PROFILE
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password
    const { password, conpassword, otp, otpExpiry, ...profileData } = user;
    res.status(200).json(profileData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 8. UPDATE PROFILE
router.post('/profile/update', authenticateToken, async (req, res) => {
  try {
    const { fname, lname, password, conpassword, gender, phone, address } = req.body;

    let updateData = {
      fname,
      lname,
      gender,
      phone,
      address
    };

    if (password || conpassword) {
      if (password !== conpassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
      updateData.password = await bcrypt.hash(password, 10);
      updateData.conpassword = conpassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    res.status(200).json({ message: 'Profile Updated Successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
