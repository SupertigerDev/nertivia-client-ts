type EventTypes =
  | "window_action"
  | "notification_badge"
  | "activity_listener_restart";
type InvokeTypes =
  | "get_store_value"
  | "set_store_value"
  | "get_running_programs";

export interface CaptureSource {
  name: string;
  id: string;
  thumbnail: string;
}

export default interface ElectronBridge {
  isElectron: boolean;
  getCaptureSources: () => Promise<CaptureSource[]>;
  send: (event: EventTypes, ...args: any) => void;
  invoke: (event: InvokeTypes, ...args: any) => Promise<any>;
  receive: any;
}
