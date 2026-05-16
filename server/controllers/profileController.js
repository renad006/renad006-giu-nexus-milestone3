const User = require('../models/User');
const bcrypt = require('bcryptjs');
const hf = require('../services/hfService');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    console.error('CHANGE PWD ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hash });
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('CHANGE PWD ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const extractSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.bio) {
      return res.status(400).json({ success: false, message: 'Bio is empty. Update your profile first.' });
    }
    try {
      const result = await hf.tokenClassification({
        model: 'dslim/bert-base-NER',
        inputs: user.bio,
      });
      console.log('RAW NER RESULT:', JSON.stringify(result));
     const cleaned = [...new Set(
  result
    .filter(e => ['B-MISC', 'I-MISC', 'B-ORG', 'I-ORG', 'MISC', 'ORG'].includes(e.entity_group))
    .map(e => e.word)
    .filter(word => !word.startsWith('##') && word.length > 2 && !/^[^a-zA-Z]/.test(word))
)];
      await User.findByIdAndUpdate(req.user._id, { skills: cleaned });
      res.status(200).json({ success: true, skills: cleaned, extracted: cleaned });
    } catch (aiErr) {
      console.error('AI ERROR:', aiErr.message);
      res.status(200).json({ success: true, skills: user.skills, extracted: user.skills });
    }
  } catch (err) {
    console.error('EXTRACT SKILLS ERROR:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
module.exports = { getProfile, updateProfile, changePassword, extractSkills };