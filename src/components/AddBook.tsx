"use client";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { DatePicker } from "./ui/datePicker";
import { AddBookAction } from "../../actions/Dynamo";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    status: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    notes: z.string().optional()
})

// This component provides a form to add a book to the library, updates the DB accordingly, and adds the new book to the appropriate column.
export default function AddBookComponent({wishlist, readBooks, ownedBooks, reading, setWishlist, setOwnedBooks, setReadBooks, setReading}:any) {
    const [open, setOpen] = useState<boolean>(false);
    const [submitText, setSubmitText] = useState<string>("Submit")
    const { toast } = useToast();

    // form schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
            status: "Wishlist",
            startDate: undefined,
            endDate: undefined,
            notes: "",
        },
    })

    // handles form submission. updates database, updates column state if needed, triggers toast
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSubmitText("Sending...")
        try {
            await AddBookAction(values);
            setOpen(false);
            toast({
                title: "Success!",
                description: "Book Added Successfully"
            });

            // update collumns with new book
            if (values.status == "Read") {
                setReadBooks([...readBooks, values]);
            } else if (values.status == "Unowned") {
                setWishlist([...wishlist, values]);
            } else if (values.status == "Reading") {
                setReading([...reading, values]);
            } else {
                setOwnedBooks([...ownedBooks, values]);
            }

            setSubmitText("Submit");
            form.reset();

        } catch (error) {
            console.error(error);
            setOpen(false);
            toast({
                title: "Oh No!",
                description: `Something went wrong.`,
            });
            setSubmitText("Submit");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant={"secondary"} className="w-full md:w-auto">Add Book</Button></DialogTrigger>
            <DialogContent>
                <DialogTitle className="text-center">Add a Book</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Hamlet" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The title of the book
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                        <Input placeholder="William Shakespeare" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The author of the book
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 w-full gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="max-w-full">
                                                    <SelectValue placeholder="Select an option" />
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
                                        </FormControl>
                                        <FormDescription>
                                            Do you own the book?
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 w-full gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <DatePicker
                                                date={field.value}
                                                setDate={(date) => field.onChange(date)}
                                                label="Start Date"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {`OPTIONAL: The date you started the book`}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <DatePicker
                                                date={field.value}
                                                setDate={(date) => field.onChange(date)}
                                                label="End Date"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {`OPTIONAL: The date you finished the book`}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <textarea
                                            placeholder="Write your notes here..."
                                            className="min-h-[200px] w-full p-4 bg-neutral-900 focus-visible:outline-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {`OPTIONAL: Notes on the book`}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">{submitText}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

