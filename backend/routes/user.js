const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Lấy danh sách
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Thêm mới
router.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

// Sửa
router.put('/users/:id', async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Xóa
router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;
