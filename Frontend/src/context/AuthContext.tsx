import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/postProps";

interface AuthContextType {
  user: User | null;
  setUser: (userData: User | null) => void;
  login: (userData: User) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data);
    } catch (error) {
      console.log("No authenticated user found", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
