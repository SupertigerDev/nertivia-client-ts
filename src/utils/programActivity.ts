export interface Program {
  filename: string;
  name: string;
  status: string;
  id: string;
}

import electronBridge from "./electronBridge";

export function programListener(callback: (filename: string) => void) {
  // restartListener();
  electronBridge?.receive("activity_status_changed", callback);
}

export function getListeningProgram(): Program[] {
  const programsString = localStorage["programActivity"];
  if (!programsString) return [];
  return JSON.parse(programsString);
}
export function findListeningProgram(filename: string): Program | null {
  const programsString = localStorage["programActivity"];
  if (!programsString) return null;
  const programsArr = JSON.parse(programsString);
  return programsArr.find((p) => p.filename === filename);
}

export function restartListener() {
  electronBridge?.send("activity_listener_restart", getListeningProgram());
}
export function stopListener() {
  electronBridge?.send("activity_listener_restart", []);
}

export function addListeningProgram(obj: Program) {
  const programs = getListeningProgram();
  programs.push(obj);
  localStorage["programActivity"] = JSON.stringify(programs);
}
