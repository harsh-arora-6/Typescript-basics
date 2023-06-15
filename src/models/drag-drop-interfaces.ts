// interface are nothing in javascript so putting it in this file and importing in app.ts will not give any error,
// however like project-model.ts its content is something in javascript and it won't know the connections within these files 
// so in tsconfig , make outfile as some file ex - bundle.js and use that in index.html

// Drag and drop interfaces
export interface Draggable {
    dragStartHandler(event : DragEvent):void;
    dragEndHandler(event: DragEvent):void;
}
export interface DragTarget {
    dragOverHandler(event: DragEvent):void;
    dropHandler(event: DragEvent):void;
    dragLeaveHandler(event: DragEvent):void;
}