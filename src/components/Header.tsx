"use client"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import AddBook from "./AddBook";

// This component holds our Clerk controls for auth as well as H1 and the trigger for the AddBook dialog
export default function Header({wishlist, readBooks, ownedBooks, reading, setWishlist, setOwnedBooks, setReadBooks, setReading}:any) {

    return (
        <header className="grid grid-cols-2 md:grid-cols-3 h-[20vh] lg:h-[5vh] min-h-24 justify-between items-center px-4">
            <div>
                <SignedOut> <SignInButton /> </SignedOut>
                <SignedIn> <UserButton /> </SignedIn>
            </div>
            <div className="bg-gradient-to-br from-white to-accent bg-clip-text">
                <h1 className="font-semibold text-2xl md:text-5xl text-center text-transparent">Book Tracker</h1>
            </div>
            <div className="flex col-span-2 md:col-span-1 justify-center md:justify-end">
                <AddBook wishlist={wishlist} readBooks={readBooks} ownedBooks={ownedBooks} reading={reading} setWishlist={setWishlist} setOwnedBooks={setOwnedBooks} setReadBooks={setReadBooks} setReading={setReading} />
            </div>
        </header>
    )
}