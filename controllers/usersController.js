const User = require("../models/User");

//get all users
exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

//get user by id
exports.getUserById = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById(_id).select("-password");
  res.json(user);
};

//update user
exports.updateUser = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password");
  res.json(user);
};

//delete user
exports.deleteUser = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findByIdAndDelete(_id);
  res.json(user);
};

//update user role
exports.updateUserRole = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findByIdAndUpdate(
    _id,
    { role: req.body.role },
    { new: true }
  );
  res.json(user);
};
