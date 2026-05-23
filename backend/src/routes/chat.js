const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('./auth');

// Apply JWT authentication to all routes below
router.use(auth.authenticateToken);

// 1. JOIN COMMUNITY
router.post('/join', async (req, res) => {
  try {
    const { communityName } = req.body;
    const username = req.user.username;

    if (!communityName) {
      return res.status(400).json({ error: 'Community name is required' });
    }

    // Check if already joined in JoinedCommunity
    const existingJoin = await prisma.joinedCommunity.findUnique({
      where: {
        username_communityName: {
          username,
          communityName
        }
      }
    });

    if (existingJoin) {
      return res.status(200).json({ message: 'already' });
    }

    // Insert record in JoinedCommunity
    await prisma.joinedCommunity.create({
      data: {
        username,
        communityName
      }
    });

    // Update community_groups members count if it exists in DB
    const commGroup = await prisma.communityGroup.findUnique({
      where: { groupName: communityName }
    });

    if (commGroup) {
      await prisma.communityGroup.update({
        where: { groupName: communityName },
        data: { membersCount: commGroup.membersCount + 1 }
      });
    }

    // Update joinedGroups column in User table (comma-separated list for compatibility)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user) {
      let updatedGroups = user.joinedGroups;
      if (updatedGroups) {
        const groupsList = updatedGroups.split(',');
        if (!groupsList.includes(communityName)) {
          updatedGroups = `${updatedGroups},${communityName}`;
        }
      } else {
        updatedGroups = communityName;
      }

      await prisma.user.update({
        where: { id: req.user.id },
        data: { joinedGroups: updatedGroups }
      });
    }

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Join community error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. FETCH MY COMMUNITIES
router.get('/my-communities', async (req, res) => {
  try {
    const username = req.user.username;

    const joined = await prisma.joinedCommunity.findMany({
      where: { username },
      orderBy: { id: 'desc' }
    });

    res.status(200).json(joined);
  } catch (error) {
    console.error('My communities error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. FETCH MESSAGES
router.get('/messages', async (req, res) => {
  try {
    const { communityName } = req.query;

    if (!communityName) {
      return res.status(400).json({ error: 'Community name query parameter is required' });
    }

    const messages = await prisma.message.findMany({
      where: { communityName },
      orderBy: { timestamp: 'asc' }
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. SEND MESSAGE
router.post('/messages', async (req, res) => {
  try {
    const { communityName, message } = req.body;
    const username = req.user.username;

    if (!communityName || !message) {
      return res.status(400).json({ error: 'Community name and message content are required' });
    }

    const newMessage = await prisma.message.create({
      data: {
        communityName,
        username,
        message
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. HEARTBEAT & GET ONLINE USERS
router.get('/online-users', async (req, res) => {
  try {
    const { communityName } = req.query;
    const username = req.user.username;

    if (!communityName) {
      return res.status(400).json({ error: 'Community name is required' });
    }

    // Insert or update current user active heartbeat
    await prisma.joinedCommunity.upsert({
      where: {
        username_communityName: {
          username,
          communityName
        }
      },
      update: { lastActive: new Date() },
      create: { username, communityName, lastActive: new Date() }
    });

    // Query active users (last active within 2 minutes)
    const threshold = new Date(Date.now() - 2 * 60 * 1000);
    const online = await prisma.joinedCommunity.findMany({
      where: {
        communityName,
        lastActive: { gte: threshold }
      },
      select: { username: true },
      orderBy: { username: 'asc' }
    });

    // Deduplicate and return
    const usernames = [...new Set(online.map(o => o.username))];
    res.status(200).json(usernames);
  } catch (error) {
    console.error('Online users error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
