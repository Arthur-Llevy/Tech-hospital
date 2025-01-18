import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-4 bg-black fixed bottom-0 w-screen flex justify-center items-center p-4 cursor-pointer">
            <span className="text-sm text-gray-300 text-center w-screen"><Link href="https://github.com/Arthur-Llevy/" target="_blank">By Arthur Levy</Link></span>
        </footer>
    );
}