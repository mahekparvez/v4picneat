import { Link, useLocation } from "wouter";
import { Camera, Circle, Triangle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 pb-safe pt-2 px-6 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto h-16">
        <Link href="/pic">
          <div className={cn("flex flex-col items-center gap-1 cursor-pointer transition-colors", location === "/pic" ? "text-blue-500" : "text-gray-400")}>
            <div className={cn("p-2 rounded-xl bg-gray-100 transition-all", location === "/pic" && "bg-blue-100")}>
               <div className="w-6 h-6 bg-blue-500 rotate-45 rounded-sm" /> 
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Pic</span>
          </div>
        </Link>

        <Link href="/">
          <div className={cn("flex flex-col items-center gap-1 cursor-pointer transition-colors", location === "/" ? "text-gray-900" : "text-gray-400")}>
            <div className={cn("p-2 rounded-full bg-gray-100 transition-all", location === "/" && "bg-gray-200")}>
              <div className="w-6 h-6 bg-gray-900 rounded-full" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Eat</span>
          </div>
        </Link>

        <Link href="/lead">
          <div className={cn("flex flex-col items-center gap-1 cursor-pointer transition-colors", location === "/lead" ? "text-gray-900" : "text-gray-400")}>
             <div className={cn("p-2 rounded-xl bg-gray-100 transition-all", location === "/lead" && "bg-gray-200")}>
               <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-gray-900" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Lead</span>
          </div>
        </Link>

         <Link href="/search">
          <div className={cn("flex flex-col items-center gap-1 cursor-pointer transition-colors", location === "/search" ? "text-gray-900" : "text-gray-400")}>
            <div className={cn("p-2 rounded-full bg-gray-100 transition-all flex items-center justify-center", location === "/search" && "bg-gray-200")}>
              <Search className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Find</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
