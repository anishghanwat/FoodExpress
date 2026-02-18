import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            expand={true}
            richColors
            closeButton
            theme="dark"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              },
            }}
          />
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
