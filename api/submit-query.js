// /api/submit-query.js
import connectDB from '../config/db.js'; 
import QueryModel from '../models/QueryModel.js'; 
import cors from 'cors';

connectDB(); // Ensure the DB is connected

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, subject, query } = req.body;

    // Validate required fields
    if (!name || !email || !query) {
      return res.status(400).json({ message: 'Name, email, and query are required.' });
    }

    // Create and save the query
    const newQuery = new QueryModel({ name, email, phone, subject, query });

    try {
      await newQuery.save();
      return res.status(200).json({ message: 'Query submitted successfully!' });
    } catch (error) {
      console.error('Error saving query:', error);
      return res.status(500).json({ message: 'Error submitting query' });
    }
  } else {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }
}
