import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export default function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean| undefined>(true);

  useEffect(() => {
    const checkNetwork = async () => {
      const { isConnected } = await Network.getNetworkStateAsync();
      setIsOnline(isConnected); // isConnected es siempre boolean
    };

    checkNetwork();

    const subscription = Network.addNetworkStateListener(({ isConnected }) => {
      setIsOnline(isConnected);
    });

    return () => subscription.remove();
  }, []);

  return isOnline ? true : false;
}