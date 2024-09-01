const router = require("express")(); // Initialize an Express router instance
const { BookModel } = require("../models/book"); // Import the Book model
const { UserModel } = require("../models/user"); // Import the User model

// Helper function to omit the password field from a user object
const omitPassword = (user) => {
  const { password, ...rest } = user;
  return rest;
};

let sessionUserId;

// Route to get all users, omitting their password fields
router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find({}); // Fetch all users
    return res
      .status(200)
      .json({ users: users.map((user) => omitPassword(user.toJSON())) }); // Respond with users, omitting passwords
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
});

// Route to borrow a book by ISBN and userId
router.post("/borrow", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.body.isbn }); // Find the book by ISBN
    if (book == null) {
      return res.status(404).json({ error: "Book not found" }); // If the book is not found, return 404
    }
    if (book.borrowedBy.length === book.quantity) {
      return res.status(400).json({ error: "Book is not available" }); // If the book is fully borrowed, return 400
    }
    const user = await UserModel.findById(req.body.userId); // Find the user by ID
    if (user == null) {
      return res.status(404).json({ error: "User not found" }); // If the user is not found, return 404
    }
    if (book.borrowedBy.includes(user.id)) {
      return res
        .status(400)
        .json({ error: "You've already borrowed this book" }); // If the user already borrowed the book, return 400
    }
    await book.update({ borrowedBy: [...book.borrowedBy, user.id] }); // Add the user to the list of borrowers
    const updatedBook = await BookModel.findById(book.uuid); // Fetch the updated book details
    return res.status(200).json({
      book: {
        ...updatedBook.toJSON(),
        availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length, // Calculate the available quantity
      },
    });
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
});

// Route to return a borrowed book
router.post("/return", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.body.isbn }); // Find the book by ISBN
    if (book == null) {
      return res.status(404).json({ error: "Book not found" }); // If the book is not found, return 404
    }
    const user = await UserModel.findById(req.body.userId); // Find the user by ID
    if (user == null) {
      return res.status(404).json({ error: "User not found" }); // If the user is not found, return 404
    }
    if (!book.borrowedBy.includes(user.id)) {
      return res
        .status(400)
        .json({ error: "You need to borrow this book first!" }); // If the user hasn't borrowed the book, return 400
    }
    await book.update({
      borrowedBy: book.borrowedBy.filter(
        (borrowedBy) => !borrowedBy.equals(user.id)
      ), // Remove the user from the list of borrowers
    });
    const updatedBook = await BookModel.findById(book.uuid); // Fetch the updated book details
    return res.status(200).json({
      book: {
        ...updatedBook.toJSON(),
        availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length, // Calculate the available quantity
      },
    });
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
});

// Route to get books borrowed by the logged-in user
router.get("/borrowed-books", async (req, res, next) => {
  console.log(req.session); // Log session data

  try {
    const result = await BookModel.find({ borrowedBy: sessionUserId });
    return res.status(200).json({ books: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get the profile of the logged-in user
router.get("/profile", async (req, res, next) => {
  try {
    const user = await UserModel.findById(sessionUserId); // Find the logged-in user by session ID
    if (user == null) {
      return res.status(404).json({ error: "User not found" }); // If the user is not found, return 404
    }
    return res.status(200).json({ user: omitPassword(user.toJSON()) }); // Respond with the user data, omitting the password
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
});

// Route to log in a user
router.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username }); // Find the user by username
    if (user == null) {
      return res.status(404).json({ error: "User not found" }); // If the user is not found, return 404
    }
    if (user.password !== req.body.password) {
      return res.status(400).json({ error: "Invalid password" }); // If the password is incorrect, return 400
    }
    sessionUserId = user.id;
    req.session.userId = user.id; // Store the user ID in the session
    return res.status(200).json({ user: omitPassword(user.toJSON()) }); // Respond with the user data, omitting the password
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
});

// Route to log out a user
router.get("/logout", (req, res) => {
  req.session.destroy(); // Destroy the session
  return res.status(200).json({ success: true }); // Respond with success
});

module.exports = { router }; // Export the router
