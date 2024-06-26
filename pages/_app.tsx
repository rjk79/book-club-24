import '../styles/styles.css';
import { config } from '../overmind';
import { createOvermind } from 'overmind';
import { Provider } from 'overmind-react';

const overmind = createOvermind(config);

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={overmind}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
