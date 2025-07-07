import { Loader2 } from "lucide-react"

export default function Loading({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full py-20 text-center">
            <Loader2 className="w-20 h-20 animate-spin text-blue-600 mb-4" />
            <p className="text-lg text-muted-foreground font-semibold">{message}</p>
        </div>
    )
}