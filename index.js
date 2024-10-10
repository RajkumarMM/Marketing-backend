import express from 'express'; 
import dotenv from 'dotenv'; 
import connectDB from './config/db.js'; 
import QueryModel from './model/QueryModel.js';
import cors from 'cors'; 

dotenv.config(); 

const app = express();

// Middleware
app.use(cors()); // Enable CORS to allow communication between frontend and backend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to the database
connectDB();

// Route to handle form submission
app.post('/submit-query', async (req, res) => {
  const { name, email, phone, subject, query } = req.body;

  // Validate required fields
  if (!name || !email || !query) {
    return res.status(400).json({ message: 'Name, email, and query are required.' });
  }

  // Create a new query instance and save it to MongoDB
  const newQuery = new QueryModel({ name, email, phone, subject, query });

  try {
    await newQuery.save(); // Wait for the save operation to complete
    res.status(200).json({ message: 'Query submitted successfully!' });
  } catch (err) {
    console.error('Error saving query:', err); // Log the error for debugging
    res.status(500).json({ message: 'Error submitting query' });
  }
});

// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
