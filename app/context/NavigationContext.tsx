import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "expo-router";
import { Link } from "expo-router";

interface NavigationContextProps {
  navigateToArticleDetail: (url: string) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(
  undefined
);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const navigateToArticleDetail = (url: string) => {
    router.push({
      pathname: "/screens/ArticleDetailNotification",
      params: { url },
    });
  };

  return (
    <NavigationContext.Provider value={{ navigateToArticleDetail }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationContext must be used within a NavigationProvider"
    );
  }
  return context;
};
