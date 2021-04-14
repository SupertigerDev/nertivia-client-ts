type EventTypes =
  | "window_action"
  | "notification_badge"
  | "activity_listener_restart";
type InvokeTypes =
  | "get_store_value"
  | "set_store_value"
  | "get_running_programs";
export default interface ElectronBridge {
  isElectron: boolean;
  send: (event: EventTypes, ...args: any) => void;
  invoke: (event: InvokeTypes, ...args: any) => Promise<any>;
  receive: any;
}
