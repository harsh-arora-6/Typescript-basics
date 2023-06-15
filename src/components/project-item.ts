import { Component } from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
import { Project } from "../models/project-model.js";
import { Draggable } from "../models/drag-drop-interfaces.js";
    // Project Item to render in project list
export class ProjectItem extends Component<HTMLUListElement,HTMLLIElement> implements Draggable{
    private project:Project;
    get persons(){
        if(this.project.people === 1){
            return '1 person';
        }else{
            return `${this.project.people} persons`;
        }
    }
    constructor(hostId:string,project:Project){
        super('single-project',hostId,false,project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    @autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain',this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }
    dragEndHandler(_: DragEvent): void {
        console.log('DragEnd');
    }
    configure(): void {
        this.elem.addEventListener('dragstart',this.dragStartHandler);
        this.elem.addEventListener('dragend',this.dragEndHandler);
    }
    renderContent():void{
        this.elem.querySelector('h2')!.textContent = this.project.title;
        this.elem.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.elem.querySelector('p')!.textContent = this.project.description;
    }
}
