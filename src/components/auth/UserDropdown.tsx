
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface UserDropdownProps {
  userName?: string;
  onSignOut: () => void;
}

export default function UserDropdown({ userName, onSignOut }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.avatar_url) {
          const { data: avatarData } = await supabase.storage
            .from('avatars')
            .createSignedUrl(profile.avatar_url, 3600);

          if (avatarData) {
            setAvatarUrl(avatarData.signedUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchUserAvatar();
  }, []);

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
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="User profile" />
          ) : (
            <AvatarFallback>
              <CircleUser className="h-5 w-5" />
            </AvatarFallback>
          )}
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
