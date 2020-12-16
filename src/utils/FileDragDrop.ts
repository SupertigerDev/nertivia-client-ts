function isFile(evt: any) {
  const dt = evt.dataTransfer;
  for (let i = 0; i < dt.types.length; i++) {
    if (dt.types[i] === "Files") {
      return true;
    }
  }
  return false;
}

export default class FileDragDrop {
  private _events: { dragEnter?: any; dragOut?: any; onDrop?: any };
  dragEnterBoundFunction: (event: any) => void;
  dropBoundFunction: (event: any) => void;
  dragLeaveBoundFunction: (event: any) => void;
  lastTarget: Element | undefined;
  constructor() {
    this._events = {};

    this.dragEnterBoundFunction = this._dragEnter.bind(this);
    this.dragLeaveBoundFunction = this._dragOut.bind(this);
    this.dropBoundFunction = this._drop.bind(this);
    window.addEventListener("dragenter", this.dragEnterBoundFunction);
    window.addEventListener("dragleave", this.dragLeaveBoundFunction);
    window.addEventListener("drop", this.dropBoundFunction);
    window.addEventListener("dragover", this._dragOver);
  }
  destroy() {
    window.removeEventListener("dragenter", this.dragEnterBoundFunction);
    window.removeEventListener("drop", this.dropBoundFunction);
    window.removeEventListener("dragleave", this.dragLeaveBoundFunction);
    window.removeEventListener("dragover", this._dragOver);
  }
  _dragOver(event: any) {
    event.preventDefault();
  }
  _dragOut(event: any) {
    event.preventDefault();
    if (event.target === this.lastTarget || event.target === document) {
      this._events?.dragOut();
    }
  }
  _dragEnter(event: any) {
    event.preventDefault();
    this.lastTarget = event.target; // cache the last target here
    if (isFile(event)) {
      this._events?.dragEnter();
    }
  }
  _drop(event: any) {
    event.preventDefault();
    if (isFile(event)) {
      this._events?.onDrop(event.dataTransfer.files[0]);
    }
  }
  onDragEnter(event: () => void) {
    this._events.dragEnter = event;
  }
  onDragOut(event: () => void) {
    this._events.dragOut = event;
  }
  onDrop(event: (file: File) => void) {
    this._events.onDrop = event;
  }
}
