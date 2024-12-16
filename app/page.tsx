"use client";
import BookCard from "@/components/BookCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GetAllBooks } from "../actions/Dynamo";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookType } from "@/lib/types";
import Header from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// gets all books. returns an array of BookType objects
async function Fetch() {
  try {
    const books = await GetAllBooks();
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

// takes the overall list and sorts into the three main columns
function BookCategorySort(books: BookType[]) {
  const readBooks: BookType[] = [];
  const ownedBooks: BookType[] = [];
  const wishlist: BookType[] = [];
  const reading: BookType[] = [];
  books.forEach((book: BookType) => {
    if (book.status === "Read") {
      readBooks.push(book);
    } else if (book.status === "Unowned") {
      wishlist.push(book);
    } else if (book.status === "Reading") {
      reading.push(book);
    } else {
      ownedBooks.push(book);
    }
  });
  return { readBooks, ownedBooks, wishlist, reading };
}


export default function Home() {
  // states for the three book columns as well as loading
  const [readBooks, setReadBooks] = useState<BookType[]>([]);
  const [ownedBooks, setOwnedBooks] = useState<BookType[]>([]);
  const [wishlist, setWishlist] = useState<BookType[]>([]);
  const [reading, setReading] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch all books, sort them, toggle loading state off
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await Fetch();
        if (fetchedBooks) {
          // @ts-ignore
          const { readBooks, ownedBooks, wishlist, reading } = BookCategorySort(fetchedBooks);
          setReadBooks(readBooks.sort((a, b) => a.title.localeCompare(b.title)));
          setOwnedBooks(ownedBooks.sort((a, b) => a.title.localeCompare(b.title)));
          setWishlist(wishlist.sort((a, b) => a.title.localeCompare(b.title)));
          setReading(reading.sort((a, b) => a.title.localeCompare(b.title)));
        }
      } catch (error) {
        console.error("Error fetching books in useEffect:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // loading ui w/ skeletons
  if (loading) {
    return (
      <div>
        <Header />
        <div className="p-2">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="order-2 xl:order-1">
              <Accordion type="single" collapsible defaultValue="read"> <AccordionItem value="read">
                <AccordionTrigger><h2 className="text-2xl font-medium mb-4 text-center w-full">Read</h2></AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="bg-gradient-to-bl from-zinc-900 to-zinc-950 h-[85vh] w-full p-6 rounded-xl">
                    <Skeleton className="w-full h-[20vh] mb-8" />
                    <Skeleton className="w-full h-[20vh] mb-8" />
                    <Skeleton className="w-full h-[20vh] mb-8" />
                    <Skeleton className="w-full h-[20vh] mb-8" />
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              </Accordion>
            </div>
            <div className="order-1 xl:order-2">
              <Accordion type="single" collapsible defaultValue="owned"> <AccordionItem value="owned">
                <AccordionTrigger><h2 className="text-2xl font-medium mb-4 text-center w-full">Owned</h2></AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="bg-gradient-to-bl from-zinc-900 to-zinc-950 h-[85vh] w-full p-6 rounded-xl">
                    <Skeleton className="w-full h-[20vh] mb-8" />
                    <Skeleton className="w-full h-[20vh] mb-8" />
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              </Accordion>
            </div>
            <div className="order-2 xl:order-3">
              <Accordion type="single" collapsible defaultValue="wishlist"> <AccordionItem value="wishlist">
                <AccordionTrigger><h2 className="text-2xl font-medium mb-4 text-center w-full">Wishlist</h2></AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="bg-gradient-to-bl from-zinc-900 to-zinc-950 h-[85vh] w-full p-6 rounded-xl">
                    <Skeleton className="w-full h-[20vh] mb-8" />
                    <Skeleton className="w-full h-[20vh] mb-8" />
                    <Skeleton className="w-full h-[20vh] mb-8" />
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // actual ui
  return (
    <div>
      <Header
        wishlist={wishlist}
        readBooks={readBooks}
        ownedBooks={ownedBooks}
        reading={reading}
        setWishlist={setWishlist}
        setOwnedBooks={setOwnedBooks}
        setReadBooks={setReadBooks}
        setReading={setReading}
      />
      <div className="p-2">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="order-2 xl:order-1">
            <Accordion type="single" collapsible defaultValue="read"> <AccordionItem value="read">
              <AccordionTrigger><h2 className="text-2xl font-medium mb-4 text-center w-full">Read</h2></AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="bg-gradient-to-bl from-zinc-900 to-zinc-950 h-[85vh] w-full p-6 rounded-xl">
                  {readBooks && readBooks.map((book) => (
                    <BookCard
                      key={book.title}
                      title={book.title}
                      author={book.author}
                      status={book.status}
                      notes={book.notes}
                      // @ts-ignore
                      dateStarted={book.startDate}
                      // @ts-ignore
                      dateFinished={book.endDate}
                      wishlist={wishlist}
                      readBooks={readBooks}
                      ownedBooks={ownedBooks}
                      reading={reading}
                      setWishlist={setWishlist}
                      setOwnedBooks={setOwnedBooks}
                      setReadBooks={setReadBooks}
                      setReading={setReading}
                    />
                  ))}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            </Accordion>
          </div>
          <div className="order-1 xl:order-2">
            <Accordion type="single" collapsible defaultValue="owned"> <AccordionItem value="owned">
              <AccordionTrigger><h2 className="text-2xl font-medium mb-4 text-center w-full">Owned</h2></AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="bg-gradient-to-bl from-zinc-900 to-zinc-950 h-[85vh] w-full p-6 rounded-xl">
                  {reading && reading.map((book) => (
                    <BookCard
                      key={book.title}
                      title={book.title}
                      author={book.author}
                      status={book.status}
                      notes={book.notes}
                      // @ts-ignore
                      dateStarted={book.startDate}
                      // @ts-ignore
                      dateFinished={book.endDate}
                      wishlist={wishlist}
                      readBooks={readBooks}
                      ownedBooks={ownedBooks}
                      reading={reading}
                      setWishlist={setWishlist}
                      setOwnedBooks={setOwnedBooks}
                      setReadBooks={setReadBooks}
                      setReading={setReading}
                    />
                  ))}
                  {ownedBooks && ownedBooks.map((book) => (
                    <BookCard
                      key={book.title}
                      title={book.title}
                      author={book.author}
                      status={book.status}
                      notes={book.notes}
                      // @ts-ignore
                      dateStarted={book.startDate}
                      // @ts-ignore
                      dateFinished={book.endDate}
                      wishlist={wishlist}
                      readBooks={readBooks}
                      ownedBooks={ownedBooks}
                      reading={reading}
                      setWishlist={setWishlist}
                      setOwnedBooks={setOwnedBooks}
                      setReadBooks={setReadBooks}
                      setReading={setReading}
                    />
                  ))}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            </Accordion>
          </div>
          <div className="order-2 xl:order-3">
            <Accordion type="single" collapsible defaultValue="wishlist"> <AccordionItem value="wishlist">
              <AccordionTrigger><h2 className="text-2xl font-medium mb-4 text-center w-full">Wishlist</h2></AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="bg-gradient-to-bl from-zinc-900 to-zinc-950 h-[85vh] w-full p-6 rounded-xl">
                  {wishlist.map((book) => (
                    <BookCard
                      key={book.title}
                      title={book.title}
                      author={book.author}
                      status={book.status}
                      notes={book.notes}
                      wishlist={wishlist}
                      readBooks={readBooks}
                      ownedBooks={ownedBooks}
                      reading={reading}
                      setWishlist={setWishlist}
                      setOwnedBooks={setOwnedBooks}
                      setReadBooks={setReadBooks}
                      setReading={setReading}
                    />
                  ))}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}