const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { authenticateToken } = require('./auth');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only' });
  }
}

// 1. GET OVERALL SITE STATS
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalGroups = await prisma.communityGroup.count();
    const totalStories = await prisma.story.count();
    const totalMessages = await prisma.message.count();

    res.status(200).json({
      totalUsers,
      totalGroups,
      totalStories,
      totalMessages
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. GET ALL USERS
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' }
    });
    // Strip passwords before sending
    const safeUsers = users.map(user => {
      const { password, conpassword, otp, otpExpiry, ...userData } = user;
      return userData;
    });
    res.status(200).json(safeUsers);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. TOGGLE/UPDATE A USER'S ROLE
router.put('/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (role !== 'ADMIN' && role !== 'USER') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    res.status(200).json({ message: 'User role updated successfully', role: updatedUser.role });
  } catch (error) {
    console.error('Admin update role error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. DELETE A USER
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own admin account!' });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. CREATE A NEW SUPPORT GROUP
router.post('/communities', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { groupName, tagline, description } = req.body;

    if (!groupName || !tagline || !description) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    // Check if community group already exists
    const existing = await prisma.communityGroup.findUnique({
      where: { groupName }
    });

    if (existing) {
      return res.status(400).json({ error: 'Community group name already exists' });
    }

    const newGroup = await prisma.communityGroup.create({
      data: {
        groupName,
        tagline,
        description
      }
    });

    res.status(201).json({ message: 'Community created successfully', newGroup });
  } catch (error) {
    console.error('Admin create community error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 6. DELETE A COMMUNITY GROUP
router.delete('/communities/:name', authenticateToken, isAdmin, async (req, res) => {
  try {
    const groupName = req.params.name;

    await prisma.communityGroup.delete({
      where: { groupName }
    });

    // Also clean up any messages in that community group
    await prisma.message.deleteMany({
      where: { communityName: groupName }
    });

    res.status(200).json({ message: 'Community group deleted successfully' });
  } catch (error) {
    console.error('Admin delete community error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 7. GET ALL PATIENT STORIES
router.get('/stories', authenticateToken, isAdmin, async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(stories);
  } catch (error) {
    console.error('Admin get stories error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 8. DELETE A STORY (MODERATION)
router.delete('/stories/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const storyId = parseInt(req.params.id);

    await prisma.story.delete({
      where: { id: storyId }
    });

    // Also delete any comments and likes on that story
    await prisma.comment.deleteMany({
      where: { storyId }
    });
    await prisma.like.deleteMany({
      where: { storyId }
    });

    res.status(200).json({ message: 'Story deleted successfully by Administrator' });
  } catch (error) {
    console.error('Admin delete story error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
