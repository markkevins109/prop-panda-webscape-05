
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUser } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface UserDropdownProps {
  userName?: string;
  userImage?: string;
  onSignOut: () => void;
}

export default function UserDropdown({ userName, userImage, onSignOut }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    onSignOut();
    setIsOpen(false);
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account"
    });
  };

  const goToProfile = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 border-2 border-[#28A745] transition-transform hover:scale-105">
          {userImage ? (
            <AvatarImage src={userImage} alt="User profile" />
          ) : null}
          <AvatarFallback>
            <CircleUser className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{userName || "User"}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
