export type DeviceStatusLabel = 'Online' | 'Offline';

export interface DeviceInfo {
  id: string;
  name: string;
  status: DeviceStatusLabel;
}
