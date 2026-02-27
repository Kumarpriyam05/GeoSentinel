import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TrackingProvider } from "@/context/TrackingContext";

export const AppProviders = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <SocketProvider>
        <TrackingProvider>{children}</TrackingProvider>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);

