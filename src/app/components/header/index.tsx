"use client"

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Header() {
    const [cookies, , removeCookies] = useCookies(["token"]);
    const [isClient, setIsClient] = useState(false);

    const logout = () => {
        removeCookies("token");
    }
  
    useEffect(() => {
      setIsClient(true);
    }, []);

    return (
        <header className="bg-black flex justify-between items-center w-screen p-4">
            <h1 className="text-3xl text-white font-bold w-screen">THosp</h1>
            {isClient && cookies.token !== undefined && cookies.token !== "" && 
                <Button 
                    className="bg-white text-black  w-24 h-9 font-bold"
                    onClick={logout}
                >Sair</Button>
            }
        </header>
    );
}