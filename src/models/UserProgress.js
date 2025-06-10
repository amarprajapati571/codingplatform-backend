const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  solvedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress; 