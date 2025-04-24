
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, LogOut, Settings, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserDropdownProps {
  userName: string;
  onSignOut: () => void;
}

export default function UserDropdown({ userName, onSignOut }: UserDropdownProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Check for demo profile in localStorage
          const demoProfileStr = localStorage.getItem("prop-panda-demo-profile");
          if (demoProfileStr) {
            try {
              const demoProfile = JSON.parse(demoProfileStr);
              if (demoProfile.avatarUrl) {
                setAvatarUrl(demoProfile.avatarUrl);
              }
            } catch (e) {
              console.error("Failed to parse demo profile:", e);
            }
          }
          return;
        }
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profile?.avatar_url) {
          const { data } = await supabase.storage
            .from('avatars')
            .createSignedUrl(profile.avatar_url, 3600);
            
          if (data) {
            setAvatarUrl(data.signedUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    
    fetchAvatar();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchAvatar();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleProfileClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    const demoAuth = localStorage.getItem("prop-panda-demo-auth");
    const isAuthenticated = !!session || demoAuth === "authenticated";
    
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/auth");
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-primary/10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={userName} />
            ) : (
              <AvatarFallback>
                <CircleUser className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-base font-medium">{userName}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a href="#" onClick={handleProfileClick}>
              <UserRound className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
