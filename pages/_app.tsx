import '../styles/styles.css';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Layout from '../components/layout/layout'
import { SessionProvider } from "next-auth/react"
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
      </SessionProvider>
    </QueryClientProvider>

  );
}

export default MyApp;
