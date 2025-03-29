
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, we would make an API call here
      // For now, we'll simulate a successful login with mock data
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 11),
        email,
        name: email.split('@')[0], // Use part of email as name
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, we would make an API call here
      // For now, we'll simulate a successful registration with mock data
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 11),
        email,
        name,
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Registration successful",
        description: `Welcome to TaskAI, ${name}!`,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
