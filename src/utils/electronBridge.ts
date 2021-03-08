import ElectronBridge from "@/interfaces/ElectronBridge";

const electronBridge: ElectronBridge | undefined = (window as any)?.api;
export default electronBridge;
