const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topic = require('./src/models/Topic');
const Problem = require('./src/models/Problem');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codingplatform')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const topics = [
  {
    title: 'Arrays and Strings',
    problems: [
      {
        name: 'Two Sum',
        leetcodeLink: 'https://leetcode.com/problems/two-sum',
        videoLink: 'https://youtube.com/watch?v=example1',
        articleLink: 'https://example.com/two-sum',
        difficulty: 'Easy'
      },
      {
        name: 'Valid Palindrome',
        leetcodeLink: 'https://leetcode.com/problems/valid-palindrome',
        videoLink: 'https://youtube.com/watch?v=example2',
        articleLink: 'https://example.com/valid-palindrome',
        difficulty: 'Easy'
      }
    ]
  },
  {
    title: 'Dynamic Programming',
    problems: [
      {
        name: 'Climbing Stairs',
        leetcodeLink: 'https://leetcode.com/problems/climbing-stairs',
        videoLink: 'https://youtube.com/watch?v=example3',
        articleLink: 'https://example.com/climbing-stairs',
        difficulty: 'Hard'
      }
    ]
  },
  {
    title: 'Linked Lists',
    problems: [
      {
        name: 'Reverse Linked List',
        leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list',
        videoLink: 'https://youtube.com/watch?v=example3',
        articleLink: 'https://example.com/reverse-linked-list',
        difficulty: 'Medium'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Topic.deleteMany({});
    await Problem.deleteMany({});
    console.log('Cleared existing data');

    // Insert topics
    const createdTopics = await Topic.insertMany(
      topics.map(topic => ({
        title: topic.title.trim() // Ensure title is trimmed
      }))
    );
    console.log('Inserted topics');

    // Create a map of topic titles to their MongoDB IDs
    const topicMap = new Map(
      createdTopics.map(topic => [topic.title, topic._id])
    );

    // Insert problems
    const problemsToInsert = topics.flatMap(topic => 
      topic.problems.map(problem => ({
        name: problem.name.trim(), // Ensure name is trimmed
        topic: topicMap.get(topic.title),
        leetcodeLink: problem.leetcodeLink.trim(), // Ensure link is trimmed
        videoLink: problem.videoLink?.trim() || '', // Optional field
        articleLink: problem.articleLink?.trim() || '', // Optional field
        difficulty: problem.difficulty // Must be one of: 'Easy', 'Medium', 'Hard'
      }))
    );

    await Problem.insertMany(problemsToInsert);
    console.log('Inserted problems');

    // Verify the data
    const insertedTopics = await Topic.find();
    const insertedProblems = await Problem.find();
    
    console.log('\nVerification:');
    console.log(`Inserted ${insertedTopics.length} topics`);
    console.log(`Inserted ${insertedProblems.length} problems`);
    
    // Log each topic and its problems
    for (const topic of insertedTopics) {
      const topicProblems = insertedProblems.filter(p => p.topic.toString() === topic._id.toString());
      console.log(`\nTopic: ${topic.title}`);
      console.log(`Problems: ${topicProblems.length}`);
      topicProblems.forEach(p => console.log(`- ${p.name} (${p.difficulty})`));
    }

    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 