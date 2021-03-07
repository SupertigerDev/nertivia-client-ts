type EventTypes = "window_action"
export default interface ElectronBridge {
    isElectron: boolean;
    send: (event: EventTypes, data?: any) => void;
}