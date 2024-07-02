import '../styles/styles.css';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Layout from '../components/layout/layout'
import { SessionProvider } from "next-auth/react"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  return (
    <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
        <Layout>
      <Component {...pageProps} />
      </Layout>
      </SessionProvider>
    </QueryClientProvider>

  );
}

export default MyApp;
