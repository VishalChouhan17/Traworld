if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('passport-local');
const { GoogleGenAI } = require("@google/genai");

const ExpressError = require("./utils/ExpressError.js");
const connectDB = require("./config/db.js");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

// 1. Core Parsers (Must stay above routes)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

// 2. Session Store Setup
const store = MongoStore.create({
  
  mongoUrl: process.env.ATLASDB_URL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOptions));
const flash = require("connect-flash");
app.use(flash());

// 3. Authentication Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// 4. Standard App Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// 5. AI Chatbot API Route (MOVED ABOVE ERROR HANDLER)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/recommend-destination", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ reply: "Please provide travel preferences!" });
    }

    // Selected _id so Gemini can generate link endpoints
    const availableListings = await Listing.find({}, "_id title price location country category description");

    if (!availableListings.length) {
      return res.json({ reply: "Sorry, we currently don't have any listings available." });
    }

    const systemInstruction = `
      You are the Traworld AI Concierge, a friendly travel assistant.
      Analyze the user's input and recommend 1 to 3 properties strictly from LISTINGS DATA.
      
      RULES:
      1. Only suggest properties present in LISTINGS DATA.
      2. Keep responses warm, concise, and helpful (under 120 words).
      3. For every property, format its name as an HTML link: <a href="/listings/_id_here" target="_blank" class="chat-link">Property Title</a>.
      4. Highlight why each choice matches their request.
    `;

    const fullPrompt = `
      LISTINGS DATA:
      ${JSON.stringify(availableListings, null, 2)}

      USER REQUEST:
      "${prompt}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      reply: "Oops! I encountered an error searching for destinations. Please try again later." 
    });
  }
});

// 6. Global Error Handling Middleware (Must stay at the VERY BOTTOM)
app.use((err, req, res, next) => {
  console.log(err);
  let { statuscode = 500, message = "Something went wrong" } = err;
  res.status(statuscode).render("err.ejs", { message });
});

// 7. Server Listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});