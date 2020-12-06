export default class FileDragDrop {
  private _events: { dragOver?: any; dragOut?: any; onDrop?: any };
  dragOverBoundFunction: (event: any) => void;
  dropBoundFunction: (event: any) => void;
  dragLeaveBoundFunction: (event: any) => void;
  constructor() {
    this._events = {};

    this.dragOverBoundFunction = this._dragOver.bind(this);
    this.dragLeaveBoundFunction = this._dragOut.bind(this);
    this.dropBoundFunction = this._drop.bind(this);
    document.addEventListener("dragover", this.dragOverBoundFunction);
    document.addEventListener("dragleave", this.dragLeaveBoundFunction);
    document.addEventListener("drop", this.dropBoundFunction);
  }
  destroy() {
    document.removeEventListener("dragover", this.dragOverBoundFunction);
    document.removeEventListener("drop", this.dropBoundFunction);
    document.removeEventListener("dragleave", this.dragLeaveBoundFunction);
  }
  _dragOut(event: any) {
    event.preventDefault();
    this._events?.dragOut();
  }
  _dragOver(event: any) {
    event.preventDefault();
    this._events?.dragOver();
  }
  _drop(event: any) {
    event.preventDefault();
    if (event.dataTransfer.items) {
      this._events?.onDrop(event.dataTransfer.files[0]);
    }
  }
  onDragOver(event: () => void) {
    this._events.dragOver = event;
  }
  onDragOut(event: () => void) {
    this._events.dragOut = event;
  }
  onDrop(event: (file: File) => void) {
    this._events.onDrop = event;
  }
}
