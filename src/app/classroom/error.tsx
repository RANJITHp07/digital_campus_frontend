'use client'; 
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <main className="flex h-screen flex-col items-center justify-center ">
        <Image src={'/error.gif'} width={500} height={500} alt="error handling"/>
      <h2 className="text-center text">Something went wrong!!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}