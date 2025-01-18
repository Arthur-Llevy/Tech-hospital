import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex py-8 justify-center">
      <main className="flex flex-col justify-between items-center gap-8 w-3/4">
        <Link href="/findExam"><Button className="w-52 h-14 font-bold text-2xl">Consulta</Button></Link>
        <Link href="#"><Button className="w-52 h-14 font-bold text-2xl">Calendário</Button></Link>
        <Link href="#"><Button className="w-52 h-14 font-bold text-2xl">Administração</Button></Link>
        <Link href="#"><Button className="w-52 h-14 font-bold text-2xl">Médico</Button></Link>
      </main>
    </div>
  );
}
