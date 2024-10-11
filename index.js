import express from 'express'; 
import dotenv from 'dotenv'; 
import connectDB from './config/db.js'; 
import cors from 'cors'; 
import homeRoute from './routes/home.js';
import queryRoutes from './routes/queryRoutes.js';
import loginSignUpRoutes from './routes/loginSignUpRoute.js';

dotenv.config(); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // This points to your views folder

// Connect to the database
connectDB();

app.use('/', homeRoute); // Use home routes for root path
app.use('/', queryRoutes); // Use query routes for handling query submissions
app.use('/', loginSignUpRoutes); 

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
