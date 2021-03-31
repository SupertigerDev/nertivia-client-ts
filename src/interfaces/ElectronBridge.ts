type EventTypes = "window_action" | "notification_badge";
type InvokeTypes =  "get_store_value" | "set_store_value";
export default interface ElectronBridge {
  isElectron: boolean;
  send: (event: EventTypes, ...args: any) => void;
  invoke: (event: InvokeTypes, ...args: any) => Promise<any>;
}
