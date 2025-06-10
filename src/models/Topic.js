const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic; 