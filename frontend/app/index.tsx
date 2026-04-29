import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';
import Domains, { ASYNC_STORAGE_DOMAIN_KEY } from './Domains';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './Home';

export default function RootLayout() {
  const [hasDomains, setHasDomains] = useState(false);

  useEffect(() => {
     AsyncStorage.getItem(ASYNC_STORAGE_DOMAIN_KEY).then((storedDomains) => {
        setHasDomains(!!storedDomains);
    });
  }, [])

  return (
    <ThemeProvider value={DarkTheme}>
      {hasDomains ? <Home /> : <Domains />}
    </ThemeProvider>
  );
}
