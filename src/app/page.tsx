import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex py-8 justify-center">
      <main className="flex flex-col justify-between items-center gap-8 w-3/4">
        <Link href="/findAppointment"><Button className="w-52 h-14 font-bold text-xl">Consulta</Button></Link>
        <Link href="/calendar"><Button className="w-52 h-14 font-bold text-xl">Calendário</Button></Link>
        <Link href="/administratorLogin"><Button className="w-52 h-14 font-bold text-xl">Área administrativa</Button></Link>
        <Link href="/doctorLogin"><Button className="w-52 h-14 font-bold text-xl">Área do médico</Button></Link>
      </main>
    </div>
  );
}
