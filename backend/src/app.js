// Load environment variables from .env file
const dotenv = require("dotenv")
dotenv.config()

// Import required modules
const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const sessions = require("express-session")
const cors = require("cors")
const { apiV1 } = require("./routes") // Importing API routes for version 1
const { connectDb } = require("./db") // Importing database connection function
const { UserModel } = require("./models/user") // Importing the User model

// Initialize the Express application
const app = express()

// CORS configuration to allow requests from the front-end
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin (your front-end)
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allowed HTTP methods
  credentials: true // Allow cookies to be sent across domains
}))

// Middleware setup
app.use(morgan("dev")) // Log HTTP requests in the console
app.use(express.json()) // Parse incoming JSON requests
app.use(cookieParser()) // Parse cookies attached to the client request
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded bodies

// Session configuration
app.use(
  sessions({
    secret: "mysecret", // Secret key to sign the session ID cookie
    saveUninitialized: true, // Save uninitialized session
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: true }, // Session expires in 24 hours
    resave: true, // Force session to be saved even when unmodified
  })
)

// Route setup
app.use("/v1", apiV1) // Mount API routes under /v1

// Handle 404 errors for undefined routes
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" })
})

// Global error handler for the application
app.use((err, req, res, next) => {
  console.error("Error:", err)
  return res.status(500).json({ error: "Unknown server error" })
})

// Connect to the database and perform initial setup
connectDb()
  .then(async () => {
    // Check if the 'admin' user exists, if not, create one
    const admin = await UserModel.findOne({ username: "admin" })
    if (admin == null) {
      await UserModel.create({ username: "admin", password: "admin", role: "admin" })
    }

    // Check if the 'guest' user exists, if not, create one
    const guest = await UserModel.findOne({ username: "guest" })
    if (guest == null) {
      await UserModel.create({ username: "guest", password: "guest", role: "guest" })
    }
  })
  .then(() => {
    // Start the server and listen on port 4000
    app.listen(process.env.PORT, () => console.log(`Server is listening on ${process.env.PORT}`))
  })
  .catch((err) => {
    // Handle errors during database connection
    console.error("Failed to connect to database", err)
    process.exit(1) // Exit the process with a failure code
  })
