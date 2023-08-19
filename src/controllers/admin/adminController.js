const bcrypt = require('bcrypt');
const DataModel = require('../../models/admin/adminModel');
const UserModel = require('../../models/customer/customerModel');
const OTPModel = require('../../models/customer/OTPModel');
const ListService = require('../../services/common/ListService');
const customerCreateService = require('../../services/user/customerCreateService');
const customerLoginService = require('../../services/user/customerLoginService');
const userUpdateService = require('../../services/user/userUpdateService');
const userDetailsService = require('../../services/user/userDetailsService');
const sendEmailUtility = require('../../utility/sendEmailUtility');

exports.Registration = async (req, res) => {
  const Result = await customerCreateService(req, DataModel);
  res.status(200).json(Result);
};

exports.Login = async (req, res) => {
  const Result = await customerLoginService(req, DataModel);
  res.status(200).json(Result);
};

// update profile
exports.updateProfile = async (req, res) => {
  const Result = await userUpdateService(req, DataModel);
  res.status(200).json(Result);
};

// get user profile
exports.getAdminProfile = async (req, res) => {
  const Result = await userDetailsService(req, DataModel);
  res.status(200).json(Result);
};

// recover verify email
exports.recoverVerifyEmail = async (req, res) => {
  const { email } = req.params;
  const OTPCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const result = await UserModel.aggregate([
      { $match: { email } },
      { $count: 'total' },
    ]);

    if (result.length > 0) {
      await OTPModel.create({ email, otp: OTPCode });
      const SendEmail = await sendEmailUtility(email, OTPCode, 'OTP Code');

      res.status(200).json({ status: 'Success', data: SendEmail });
    } else {
      res.status(400).json({ status: 'Success', data: 'Email not found' });
    }
  } catch (error) {
    res.status(400).json({ status: 'Success', data: error });
  }
};

// recover verify OTP
exports.recoverVerifyOTP = async (req, res) => {
  const { email, otp } = req.params;

  try {
    const otpCount = await OTPModel.aggregate([
      { $match: { email, otp, status: 0 } },
    ]);

    if (otpCount.length > 0) {
      const result = await OTPModel.updateOne(
        { email, otp, status: 0 },
        { status: 1 },
      );
      res.status(200).json({ status: 'Success', data: result });
    } else {
      res.status(400).json({ status: 'Success', data: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', data: error });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const otpCount = await OTPModel.aggregate([
      { $match: { email, otp, status: 1 } },
    ]);
    if (otpCount.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedPass = await UserModel.updateOne(
        { email },
        { password: hashedPassword },
      );
      res.status(200).json({ status: 'Success', data: updatedPass });
    } else {
      res.status(400).json({ status: 'error', data: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', data: error });
  }
};

exports.getUsers = async (req, res) => {
  const SearchRgx = { $regex: req.params.searchKeyword, $options: 'i' };
  const SearchArray = [{ email: SearchRgx }, { firstName: SearchRgx },
    { lastName: SearchRgx }, { phoneNo: SearchRgx }];
  const Result = await ListService(req, UserModel, SearchArray);
  res.status(200).json(Result);
};
