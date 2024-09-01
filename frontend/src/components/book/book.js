
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom"
import {
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@mui/material"
import { NotificationManager } from "react-notifications"
import { BackendApi } from "../../client/backend-api"
import { useUser } from "../../context/user-context"
import { TabPanel } from "../tabs/tab"
import classes from "./styles.module.css"

export const Book = () => {
    const { bookIsbn } = useParams()
    const { user, isAdmin } = useUser()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)

    const borrowBook = () => {
        if (book && user) {
            BackendApi.user
                .borrowBook(book.isbn, user._id)
                .then(({ book, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setBook(book)
                    }
                })
                .catch(console.error)
        }
    }

    const returnBook = () => {
        if (book && user) {
            BackendApi.user
                .returnBook(book.isbn, user._id)
                .then(({ book, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setBook(book)
                    }
                })
                .catch(console.error)
        }
    }

    useEffect(() => {
        if (bookIsbn) {
            BackendApi.book
                .getBookByIsbn(bookIsbn)
                .then(({ book, error }) => {
                    if (error) {
                        NotificationManager.error(error)
                    } else {
                        setBook(book)
                    }
                })
                .catch(console.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookIsbn])

    return (
        book && (
            <div className={classes.wrapper}>
                <Typography variant="h5" align="center" style={{ marginBottom: 20 }}>
                    Book Details
                </Typography>
                <Card>

                    <TabPanel>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell variant="head" component="th" width="200">
                                            Name
                                        </TableCell>
                                        <TableCell>{book.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            ISBN
                                        </TableCell>
                                        <TableCell>{book.isbn}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Category
                                        </TableCell>
                                        <TableCell>{book.category}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Quantity
                                        </TableCell>
                                        <TableCell>{book.quantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Available
                                        </TableCell>
                                        <TableCell>{book.availableQuantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Price
                                        </TableCell>
                                        <TableCell>${book.price}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </TabPanel>

                   <CardActions disableSpacing>
                        <div className={classes.btnContainer}>
                            {isAdmin ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component={RouterLink}
                                    to={`/admin/books/${bookIsbn}/edit`}
                                >
                                    Edit Book
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="contained"
                                        onClick={borrowBook}
                                        disabled={book && user && book.borrowedBy.includes(user._id)}
                                    >
                                        Borrow
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={returnBook}
                                        disabled={book && user && !book.borrowedBy.includes(user._id)}
                                    >
                                        Return
                                    </Button>
                                </>
                            )}
                            <Button type="submit" variant="text" color="primary" onClick={() => navigate(-1)}>
                                Go Back
                            </Button>
                        </div>
                    </CardActions>
                </Card>
            </div>
        )
    )
}