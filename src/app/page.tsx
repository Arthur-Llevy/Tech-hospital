"use client"

import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [cookies] = useCookies(["token"]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex py-8 justify-center">
      <main className="flex flex-col justify-between items-center gap-8 w-3/4">
        <Link href="/findAppointment"><Button className="w-52 h-14 font-bold text-2xl">Consulta</Button></Link>
        <Link href="/calendar"><Button className="w-52 h-14 font-bold text-2xl">Calendário</Button></Link>
        <Link href="/administratorLogin"><Button className="w-52 h-14 font-bold text-2xl">Administração</Button></Link>
        <Link href="#"><Button className="w-52 h-14 font-bold text-2xl">Médico</Button></Link>
        {isClient && cookies.token !== undefined && cookies.token !== "" && 
          <Link href="#"><Button className="w-52 h-14 font-bold text-2xl">Marcações</Button></Link>
        }
      </main>
    </div>
  );
}
