const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('./auth');

// Apply JWT authentication to all routes below
router.use(auth.authenticateToken);

// 1. GET ALL STORIES
router.get('/', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Populate comments and likes count for each story
    const populatedStories = await Promise.all(
      stories.map(async (story) => {
        const comments = await prisma.comment.findMany({
          where: { storyId: story.id },
          orderBy: { createdAt: 'asc' }
        });

        const likesCount = await prisma.like.count({
          where: { storyId: story.id }
        });

        const hasLiked = await prisma.like.findUnique({
          where: {
            storyId_username: {
              storyId: story.id,
              username: req.user.username
            }
          }
        });

        return {
          ...story,
          comments,
          likesCount,
          hasLiked: !!hasLiked
        };
      })
    );

    res.status(200).json(populatedStories);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. CREATE STORY
router.post('/', async (req, res) => {
  try {
    const { community, story } = req.body;
    const username = req.user.username;

    if (!community || !story) {
      return res.status(400).json({ error: 'Community and Story are required' });
    }

    const newStory = await prisma.story.create({
      data: {
        name: username,
        community,
        story
      }
    });

    res.status(201).json(newStory);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. EDIT STORY
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { story } = req.body;
    const username = req.user.username;

    const existingStory = await prisma.story.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (existingStory.name !== username) {
      return res.status(403).json({ error: 'Unauthorized to edit this story' });
    }

    const updatedStory = await prisma.story.update({
      where: { id: parseInt(id) },
      data: { story }
    });

    res.status(200).json(updatedStory);
  } catch (error) {
    console.error('Edit story error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. DELETE STORY
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const username = req.user.username;

    const existingStory = await prisma.story.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (existingStory.name !== username) {
      return res.status(403).json({ error: 'Unauthorized to delete this story' });
    }

    // Cascade delete likes and comments first
    await prisma.like.deleteMany({ where: { storyId: parseInt(id) } });
    await prisma.comment.deleteMany({ where: { storyId: parseInt(id) } });

    await prisma.story.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. TOGGLE LIKE
router.post('/:id/like', async (req, res) => {
  try {
    const storyId = parseInt(req.params.id);
    const username = req.user.username;

    const existingStory = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!existingStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        storyId_username: {
          storyId,
          username
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          storyId_username: {
            storyId,
            username
          }
        }
      });
      const likesCount = await prisma.like.count({ where: { storyId } });
      res.status(200).json({ liked: false, likesCount });
    } else {
      // Like
      await prisma.like.create({
        data: {
          storyId,
          username
        }
      });
      const likesCount = await prisma.like.count({ where: { storyId } });
      res.status(200).json({ liked: true, likesCount });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 6. POST COMMENT
router.post('/:id/comment', async (req, res) => {
  try {
    const storyId = parseInt(req.params.id);
    const { comment } = req.body;
    const username = req.user.username;

    if (!comment) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const existingStory = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if (!existingStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const newComment = await prisma.comment.create({
      data: {
        storyId,
        username,
        comment
      }
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Post comment error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
