"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User as UserIcon, LogOut, Settings, LayoutDashboard } from "lucide-react";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/discover", label: "Discover" },
  { href: "/community-goals", label: "Community Goals" },
  { href: "/public-ledger", label: "Public Ledger" },
];

const loggedInNavLinks = [
    { href: "/dashboard/borrower", label: "Borrower Dashboard" },
    { href: "/dashboard/contributor", label: "Contributor Dashboard" },
]

export default function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully signed out.",
      });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while signing out. Please try again.",
      });
    }
  };
  
  const NavLink = ({ href, label, className, onClick }: { href: string; label: string; className?: string, onClick?: () => void }) => (
     <Link
        href={href}
        onClick={onClick}
        className={cn("font-medium text-foreground/60 transition-colors hover:text-foreground", className)}
    >
        {label}
    </Link>
  );


  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user-avatar/100/100"} alt={user?.displayName || "User"} />
            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || "Account"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/borrower">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Borrower Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/contributor">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Contributor Dashboard</span>
          </Link>
        </DropdownMenuItem>
         <DropdownMenuItem asChild>
          <Link href="/verify-id">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Verify ID</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderAuthButtons = () => (
    <div className="hidden md:flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            {isLoggedIn && loggedInNavLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? renderUserMenu() : renderAuthButtons()}
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Logo />
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href} label={link.label} onClick={() => setIsSheetOpen(false)}/>
                  ))}
                   {isLoggedIn && (
                        <div className="border-t pt-4 mt-2 flex flex-col gap-4">
                             {loggedInNavLinks.map((link) => (
                                <NavLink key={link.href} href={link.href} label={link.label} onClick={() => setIsSheetOpen(false)}/>
                            ))}
                        </div>
                    )}
                </nav>
                <div className="border-t pt-4">
                  {!isLoggedIn && (
                     <div className="flex flex-col gap-2">
                        <Button variant="outline" asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                     </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
