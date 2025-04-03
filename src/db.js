import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe_db'; // Use environment variable or default
    
    // Add more connection options for better error handling
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      retryWrites: true
    };
    
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI, options);
    console.log('MongoDB Connected');
    return true;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB server. Check network or IP whitelist settings.');
    } else if (error.name === 'MongoError' && error.message.includes('Authentication failed')) {
      console.error('Authentication failed. Check username and password.');
    }
    return false; // Return false instead of exiting the process
  }
};

export default connectDB;
