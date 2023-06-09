import { Component } from "./base-component";
import { autobind } from "../decorators/autobind";
import { Project } from "../models/project-model";
import { DragTarget } from "../models/drag-drop-interfaces";
import { ProjectStatus } from "../models/project-model";
import { projectState } from "../state/project-state";
import { ProjectItem } from "./project-item";
// Project List
export class ProjectList extends Component<HTMLDivElement,HTMLElement> implements DragTarget{
assignedProjects: Project[] = [];
constructor(private type:'active'|'finished'){
    super('project-list','app',false,`${type}-projects`);
    
    this.configure();
    // fill the content
    this.renderContent();
}
@autobind
dragOverHandler(event: DragEvent): void {
    // only certain types of components should be droppable to a droppable area
    if(event.dataTransfer && event.dataTransfer.types[0] == 'text/plain'){
        event.preventDefault();// default behaviour is to not allow dropping
        const list = this.elem.querySelector('ul')!;
        list.classList.add('droppable');          
    }
}
@autobind
dropHandler(event: DragEvent): void {
    const id = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(id,this.type === 'active'?ProjectStatus.Active:ProjectStatus.Finished);
    const list = this.elem.querySelector('ul')!;
    list.classList.remove('droppable');
}
@autobind
dragLeaveHandler(_: DragEvent): void {
    const list = this.elem.querySelector('ul')!;
    list.classList.remove('droppable');
}
configure(){
    projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((project: Project) => {
            if(this.type === 'active'){
                return project.status === ProjectStatus.Active;
            }
            return project.status === ProjectStatus.Finished;
        })
        this.assignedProjects = relevantProjects;
        this.renderProjects();
    })
    this.elem.addEventListener('dragover',this.dragOverHandler);
    this.elem.addEventListener('drop',this.dropHandler);
    this.elem.addEventListener('dragleave',this.dragLeaveHandler);
}
renderContent(){
    this.elem.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    this.elem.querySelector('ul')!.id = `${this.type}-projects-list`;
}
private renderProjects(){
    const list = document.getElementById(`${this.type}-projects-list`)!;
    list.innerHTML = '';
    for(const project of this.assignedProjects){
        // const listItem = document.createElement('li');
        // listItem.textContent = project.title;
        // list.appendChild(listItem);
        // console.log(project);
        new ProjectItem(list.id,project);
    }
}

}