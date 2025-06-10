const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  leetcodeLink: {
    type: String,
    required: true,
    trim: true
  },
  videoLink: {
    type: String,
    trim: true
  },
  articleLink: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  }
}, {
  timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem; 