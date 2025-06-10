const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const User = require('../models/User');

// Get user's progress for all topics
router.get('/questions', auth, async (req, res) => {
  try {
    const { _id } = req.user;
    
    // Get all topics
    const topics = await Topic.find().sort({ createdAt: 1 });
    
    // Get user's solved problems
    const solvedProblems = await UserProgress.find({ userId:_id });
    const solvedProblemIds = new Set(solvedProblems.map(sp => sp.problemId.toString()));

    // Get problems for each topic and calculate progress
    const formattedTopics = await Promise.all(
      topics.map(async (topic, index) => {
        const problems = await Problem.find({ topic: topic._id }).sort({ createdAt: 1 });
        const totalProblems = problems.length;
        const solvedCount = problems.filter(p => solvedProblemIds.has(p._id.toString())).length;
        const progress = totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);

        return {
          _id: topic._id,
          title: topic.title,
          progress,
          problems: problems.map((p, pIndex) => ({
            _id: p._id,
            name: p.name,
            leetcodeLink: p.leetcodeLink,
            videoLink: p.videoLink,
            articleLink: p.articleLink,
            difficulty: p.difficulty,
            completed: solvedProblemIds.has(p._id.toString())
          }))
        };
      })
    );

    res.json(formattedTopics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user progress', error: error.message });
  }
});

// Update user progress
router.put('/update', auth, async (req, res) => {
  try {
    const { topicId, problemId, completed } = req.body;
    const userId = req.user._id;  

    if (!completed) {
      const progress = await UserProgress.findOneAndDelete({ userId, topicId, problemId });
      return res.json(progress);
    } else {
      // Use findOneAndUpdate to handle duplicates
      const progress = await UserProgress.findOneAndUpdate(
        { userId, problemId },
        { topicId, solvedAt: new Date() },
        { new: true, upsert: true }
      );
      return res.json(progress);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user progress', error: error.message });
  }
});

// GET /profile/summary
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. User info
    const user = await User.findById(userId);

    // 2. Total problems
    const totalProblems = await Problem.countDocuments();

    // 3. Solved problems
    const solvedProgress = await UserProgress.find({ userId }).populate('problemId');
    const solvedProblems = solvedProgress.length;

    // 4. Completion rate
    const completionRate = totalProblems === 0 ? 0 : Math.round((solvedProblems / totalProblems) * 100);

    // 5. Daily progress (last 30 days)
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29);
    startDate.setHours(0, 0, 0, 0); // Start of day 30 days ago

    // Aggregate solved problems by day
    const dailyProgress = await UserProgress.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          solvedAt: { 
            $gte: startDate,
            $lte: today
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$solvedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing days with 0
    const dailyData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const found = dailyProgress.find(d => d._id === dateStr);
      dailyData.push({
        date: dateStr,
        count: found ? found.count : 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 6. Problems solved by difficulty
    const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
    solvedProgress.forEach(p => {
      if (p.problemId && p.problemId.difficulty) {
        difficultyCounts[p.problemId.difficulty] = (difficultyCounts[p.problemId.difficulty] || 0) + 1;
      }
    });

    // 7. Retrieve recently solved problems (last 6)
    let recentProblems = await UserProgress.find({ userId })
      .populate('problemId')
      .populate('topicId')
      .sort({ solvedAt: -1 })
      .limit(6);

    recentProblems = recentProblems.map(progress => ({
      title: progress.problemId.name,
      topic: progress.topicId.title,
      difficulty: progress.problemId.difficulty,
      solvedAt: progress.solvedAt
    }));

    res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        memberSince: user.createdAt
      },
      totalProblems,
      solvedProblems,
      completionRate,
      dailyProgress: dailyData,
      problemsByDifficulty: difficultyCounts,
      recentProblems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile summary', error: error.message });
  }
});

module.exports = router; 