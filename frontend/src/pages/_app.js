import '@/app/globals.css';
import { AuthProvider } from "@/app/components/context"

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
