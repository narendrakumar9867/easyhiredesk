import React from "react";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children}: { children: React.ReactNode}) {
  return(
    <html lang="en">
      <body>
        {children}
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              zIndex: 99999, 
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}

