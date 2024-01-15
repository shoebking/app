require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoute);
mongoose.connect('mongodb+srv://shoebahmed061:8179609105@cluster0.wjpgp9b.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle MongoDB connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mongoose Schema
const feedbackSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  category: {
    type: [String],
    required: true,
  },
  rating: {
    type: [Number],
    required: true,
  },
  comments: String,
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes
app.post('/api/feedback', async (req, res) => {
  try {
    const {email, category, rating, comments } = req.body;

    const feedback = new Feedback({
      email,
      category,
      rating,
      comments,
    });

    await feedback.save();

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback submission failed:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/feedback/get', async (req, res) => {
    try {
      // const email = req.params.email;
  
      // Fetch feedback data for the specified category
      const feedbackData = await Feedback.find({});
  
      res.json({ feedbackData });
    } catch (error) {
      console.error('Feedback retrieval failed:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // app.get('/api/feedback/:email', async (req, res) => {
  //   try {
  //     const email = req.params.email;
  
  //     // Fetch feedback data for the specified category
  //     const feedbackData = await Feedback.find({email});
  
  //     res.json({ email, feedbackData });
  //   } catch (error) {
  //     console.error('Feedback retrieval failed:', error.message);
  //     res.status(500).json({ success: false, message: 'Internal server error' });
  //   }
  // });

const port = 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));

