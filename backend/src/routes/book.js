const router = require("express")(); // Initialize a new Express router
const { BookModel } = require("../models/book"); // Import the Book model from the models directory

// Route to get a list of all books
router.get("/", async (req, res, next) => {
  try {
    // Fetch all books from the database
    const books = await BookModel.find({});

    // Return the list of books with the available quantity calculated
    return res.status(200).json({
      books: books.map((book) => ({
        ...book.toJSON(),
        availableQuantity: book.quantity - book.borrowedBy.length,
      })),
    });
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
});

// Route to get a specific book by its ISBN
router.get("/:bookIsbn", async (req, res, next) => {
  try {
    // Find the book with the provided ISBN
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn });
    
    if (book == null) {
      return res.status(404).json({ error: "Book not found" }); // Return a 404 error if the book doesn't exist
    }

    // Return the book details with the available quantity calculated
    return res.status(200).json({
      book: {
        ...book.toJSON(),
        availableQuantity: book.quantity - book.borrowedBy.length,
      },
    });
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
});

// Route to add a new book to the collection
router.post("/", async (req, res, next) => {
  try {
    // Check if a book with the same ISBN already exists
    const book = await BookModel.findOne({ isbn: req.body.isbn });
    
    if (book != null) {
      return res.status(400).json({ error: "Book with same ISBN already found" }); // Return a 400 error if the ISBN is already taken
    }

    // Create a new book with the provided data
    const newBook = await BookModel.create(req.body);

    // Return the newly created book
    return res.status(200).json({ book: newBook });
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
});

// Route to update an existing book by its ISBN
router.patch("/:bookIsbn", async (req, res, next) => {
  try {
    // Find the book with the provided ISBN
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn });
    
    if (book == null) {
      return res.status(404).json({ error: "Book not found" }); // Return a 404 error if the book doesn't exist
    }

    // Update the book with the new data, excluding _id and isbn fields
    const { _id, isbn, ...rest } = req.body;
    const updatedBook = await book.update(rest);

    // Return the updated book
    return res.status(200).json({ book: updatedBook });
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
});

// Route to delete a book by its ISBN
router.delete("/:bookIsbn", async (req, res, next) => {
  try {
    // Find the book with the provided ISBN
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn });

    if (book == null) {
      return res.status(404).json({ error: "Book not found" }); // Return a 404 error if the book doesn't exist
    }

    // Delete the book from the database
    await book.delete();

    // Return a success response
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err); // Pass any errors to the error-handling middleware
  }
});

module.exports = { router }; // Export the router for use in other parts of the application
