import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              expand={true}
              richColors
              closeButton
              theme="system"
              toastOptions={{
                style: {
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                },
              }}
            />
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
