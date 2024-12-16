"use client";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle, CardFooter, CardHeader, CardDescription } from "./ui/card";
import { DatePicker } from "./ui/datePicker";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCallback, useState } from "react";
import { DeleteBookAction, UpdateBookAction } from "../../actions/Dynamo";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react"

// This component represents each book in the library. It consumes and modifies state as needed to manage it's own content and where it sits in the app overall. It also handles DB updates and deletes via Server Actions.
export default function BookCard({ title, author, dateStarted, dateFinished, notes, status, wishlist, readBooks, ownedBooks, reading, setWishlist, setOwnedBooks, setReadBooks, setReading }: any) {
    const [bookStatus, setBookStatus] = useState<string>(status);
    const [startDate, setStartDate] = useState<string | Date | undefined>(dateStarted);
    const [endDate, setEndDate] = useState<string | Date | undefined>(dateFinished);
    const [bookNotes, setBookNotes] = useState<string | undefined>(notes)
    const [saveText, setSaveText] = useState<string>("Save Changes");
    const [removeOpen, setRemoveOpen] = useState<boolean>(false);
    const { toast } = useToast();

    // Used as a comparison point for conditionally rendering a save button
    const [initialState, setInitialState] = useState({
        status: status,
        startDate: dateStarted,
        endDate: dateFinished,
        bookNotes: notes,
    });

    // Returns true if current state changes from initial state - also used for save button
    const isModified = useCallback(() => {
        return bookStatus !== initialState.status ||
            startDate !== initialState.startDate ||
            endDate !== initialState.endDate ||
            bookNotes !== initialState.bookNotes;
    }, [bookStatus, startDate, endDate, initialState, bookNotes]);

    // Updates database entry with new info, changes save button text, resets initial state, triggers toast, updates state for 3 main columns if needed
    function UpdateDB() {
        try {
            setSaveText("Saving...");
            UpdateBookAction({
                title: title,
                author: author,
                status: bookStatus,
                // @ts-ignore
                startDate: startDate,
                endDate: endDate,
                notes: bookNotes
            })

            // conditional ladder for adding book to new category
            if (bookStatus != initialState.status) {
                if (bookStatus == "Read") {
                    setReadBooks([...readBooks, {
                        title: title,
                        author: author,
                        status: bookStatus,
                        dateStarted: startDate,
                        dateFinished: endDate,
                        notes: bookNotes
                    }]);

                } else if (bookStatus == "Unowned") {
                    setWishlist([...wishlist, {
                        title: title,
                        author: author,
                        status: bookStatus,
                        dateStarted: startDate,
                        dateFinished: endDate,
                        notes: bookNotes
                    }]);

                } else if (bookStatus == "Reading") {
                    setReading([...reading, {
                        title: title,
                        author: author,
                        status: bookStatus,
                        dateStarted: startDate,
                        dateFinished: endDate,
                        notes: bookNotes
                    }]);

                } else {
                    setOwnedBooks([...ownedBooks, {
                        title: title,
                        author: author,
                        status: bookStatus,
                        dateStarted: startDate,
                        dateFinished: endDate,
                        notes: bookNotes
                    }]);

                }

                // conditional ladder for removing book from old category
                if (initialState.status == "Read") {
                    let updatedRead = readBooks.filter((book: { title: any; }) => book.title != title)
                    setReadBooks(updatedRead);

                } else if (initialState.status == "Unowned") {
                    let updatedWishlist = wishlist.filter((book: { title: any; }) => book.title != title)
                    setWishlist(updatedWishlist);

                } else if (initialState.status == "Reading") {
                    let updatedReading = reading.filter((book: { title: any; }) => book.title != title)
                    setReading(updatedReading);

                } else {
                    let updatedOwned = ownedBooks.filter((book: { title: any; }) => book.title != title)
                    setOwnedBooks(updatedOwned);
                }

            }
        } catch (error) {
            toast({
                title: "Oh No...",
                description: "Something went wrong"
            })
            setSaveText("Try Again");
        } finally {
            toast({
                title: "Success!",
                description: "Changes saved"
            })

            // reset initial state so conditional button rendering works again
            setInitialState({
                status: bookStatus,
                startDate: startDate,
                endDate: endDate,
                bookNotes: bookNotes,
            });
            setSaveText("Save Changes");
        }
    }

    // Removes book from databse and updates column state accordingly
    function RemoveFromLibrary() {
        let successSubMessage = title + ` was removed from your library.`
        try {
            DeleteBookAction(title, author)
            if (bookStatus == "Read") {
                let updatedRead = readBooks.filter((book: { title: any; }) => book.title != title)
                setReadBooks(updatedRead);

            } else if (bookStatus == "Unowned") {
                let updatedWishlist = wishlist.filter((book: { title: any; }) => book.title != title)
                setWishlist(updatedWishlist);

            } else if (bookStatus == "Reading") {
                let updatedReading = reading.filter((book: { title: any; }) => book.title != title)
                setReading(updatedReading);

            } else {
                let updatedOwned = ownedBooks.filter((book: { title: any; }) => book.title != title)
                setOwnedBooks(updatedOwned);
            }
            toast({
                title: "Great!",
                description: successSubMessage
            })

        } catch (error) {
            console.log(error);
            toast({
                title: "Oh No...",
                description: "Something went wrong"
            })
        }
    }

    return (
        <Card className="w-full mb-8 shadow-md bg-gradient-to-br from-neutral-900 to-neutral-950">
            {/* this section is just for the dropdown/dialog for the delete button */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <EllipsisVertical className="relative top-4 left-[90%] md:left-[95%] right-0 hover:scale-110 transition-all duration-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 flex p-2 justify-center">
                    <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
                        <DialogTrigger asChild><Button variant={"destructive"}>Remove Book from Library</Button></DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="text-center">Are you sure?</DialogTitle>
                            <DialogDescription className="text-center">{`This will remove ${title} from your library. This cannot be undone.`}</DialogDescription>
                            <Button variant={"destructive"} onClick={RemoveFromLibrary}>Remove Book</Button>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* here's the main card */}
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{author}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-wrap gap-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <Select onValueChange={setBookStatus}>
                        <SelectTrigger className="max-w-full">
                            <SelectValue placeholder={status} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Unowned">Unowned</SelectItem>
                            <SelectItem value="Borrowed">Borrowed</SelectItem>
                            <SelectItem value="Owned Digitally">Owned Digitally</SelectItem>
                            <SelectItem value="Owned Physically">Owned Physically</SelectItem>
                            <SelectItem value="Owned Digitally and Physically">{`Owned Digitally & Physically`}</SelectItem>
                            <SelectItem value={'Read'}>Read</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog>
                        <DialogTrigger asChild><Button variant={"outline"}>Notes</Button></DialogTrigger>
                        <DialogContent className="w-[80vw]">
                            <DialogTitle className="font-light">
                                {`Your Notes on `}<span className="italic font-semibold">{title}</span>
                            </DialogTitle>
                            <textarea
                                value={bookNotes}
                                onChange={(e) => setBookNotes(e.target.value)}
                                placeholder="Write your notes here..."
                                className="min-h-[200px] p-4 bg-neutral-900 focus-visible:outline-none"
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                {status != "Unowned" ? <div className="flex flex-wrap 4xl:flex-nowrap items-center gap-4">
                    <DatePicker date={startDate} setDate={setStartDate} label="Start Date" />
                    <p className="font-light text-center w-full text-sm">Through:</p>
                    <DatePicker date={endDate} setDate={setEndDate} label="End Date" />
                </div> : null}
                <div className="flex flex-row justify-between">
                    {isModified() ? <Button type="submit" onClick={UpdateDB} variant="secondary">{saveText}</Button> : null}
                </div>
            </CardContent>
        </Card>
    )
}