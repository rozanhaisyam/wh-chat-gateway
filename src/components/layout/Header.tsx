
import { BellIcon, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header({ title }: { title: string }) {
  return (
    <header className="border-b p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="w-[200px] lg:w-[300px] pl-8"
            />
          </div>
          
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
          </Button>
          
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?img=12" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
