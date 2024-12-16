export interface BookType {
    title: string,
    author: string,
    status: string,
    dateStarted?: string,
    dateFinished?: string,
    notes?: string
}

export interface DatePickerProps {
    date: Date | string | undefined
    setDate: (date: string | Date | undefined) => void
    label: string
}

export type BookCardType = BookType & {
    wishlistCategory: BookType[],
    ownedCategory: BookType[],
    readCategory: BookType[],
    setWishlistCategory: any,
    setOwnedCategory: any,
    setReadCategory: any
}