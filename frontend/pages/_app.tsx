import type { AppProps } from 'next/app';
import wrapper from '@/redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <Component {...props.pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
export default App;
