import {useMemo} from 'react';
import {useAppState} from '../state/appState';
import type {DeviceInfo} from '../types/device';

export const useSelectedDevice = (): DeviceInfo => {
  const {
    state: {deviceId, deviceStatus},
  } = useAppState();

  return useMemo(() => {
    const status = deviceStatus === 'pairedOnline' ? 'Online' : 'Offline';
    return {
      id: deviceId ?? 'commutelive-001',
      name: deviceId ? `Device ${deviceId}` : 'Device 1',
      status,
    };
  }, [deviceId, deviceStatus]);
};
