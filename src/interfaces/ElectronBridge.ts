type EventTypes = "window_action" | "notification_badge";
export default interface ElectronBridge {
  isElectron: boolean;
  send: (event: EventTypes, data?: any) => void;
}
