// Code goes here!
// importing namespaces
/// <reference path="drag-drop-interfaces.ts" />
/// <reference path="project-model.ts" />  
namespace App{
    // create a decorator to auto bind the submit handler to 'this'
// first parameter is target,second is methodName but we used _ to begin the parameter name as we don't have any use of them and we want typescript to 
// not give any error or we can set noUnusedParameters to false in tsconfig.json
function autobind(_:any,_2:string,descriptor:PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjustedDescriptor :PropertyDescriptor = {
        configurable:true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    }
    return adjustedDescriptor;
} 
interface Validateable {
    value:string | number;
    required?:boolean;
    minLength?:number;
    maxLength?:number;
    min?:number;
    max?:number;
}
function validate(validateableObj: Validateable){
    let isValid = true;
    if(validateableObj.required){
        isValid = isValid && validateableObj.value.toString().trim().length > 0;
    }
    if(validateableObj.minLength != null && typeof validateableObj.value == 'string'){
        isValid = isValid && validateableObj.value.length > validateableObj.minLength;
    }
    if(validateableObj.maxLength != null && typeof validateableObj.value == 'string'){
        isValid = isValid && validateableObj.value.length < validateableObj.maxLength;
    }
    if(validateableObj.min != null && typeof validateableObj.value == 'number'){
        isValid = isValid && validateableObj.value > validateableObj.min;
    }
    if(validateableObj.maxLength != null && typeof validateableObj.value == 'number'){
        isValid = isValid && validateableObj.value < validateableObj.maxLength;
    }
    return isValid;
}


type Listener<T> = (projects:T[])=>void
class State<T>{
    // protected so that we can access it from inheriting class
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    }
}
// Project State Management
class ProjectState extends State<Project>{
    private projects : Project[] = [];
    private static instance: ProjectState;
    private constructor(){
        super();
    }
    static getInstance(){
        if(this.instance){
            return this.instance;
        }else{
            return this.instance = new ProjectState();
        }
    }
    
    addProject(title: string,description: string, people: number){
        const newProject = new Project(Math.random().toString(),title,description,people,ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(projectId:string,status:ProjectStatus){
        const project = this.projects.find((prj:Project )=> prj.id === projectId);
        if(project && project.status !== status){
            project.status = status;
            this.updateListeners();
        }
    }
    private updateListeners(){
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
abstract class Component<T extends HTMLElement,U extends HTMLElement>{
    projectElem: HTMLTemplateElement;
    hostElem: T;
    elem: U;
    constructor(projectId:string,hostId:string,insertAtStart:boolean,elementId:string){
        this.projectElem = document.getElementById(projectId)! as HTMLTemplateElement;
        this.hostElem = document.getElementById(hostId)! as T;
        // reference to child of template element
        const importedNode = document.importNode(this.projectElem.content,true);
        this.elem = importedNode.firstElementChild! as U;
        this.elem.id = elementId;
        this.attach(insertAtStart);
    }
    private attach(insertAtStart:boolean){
        this.hostElem.insertAdjacentElement(insertAtStart?'afterbegin':'beforeend',this.elem);
    }
    abstract configure():void;
    abstract renderContent():void;

}
// Project Item to render in project list
class ProjectItem extends Component<HTMLUListElement,HTMLLIElement> implements Draggable{
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
// Project List
class ProjectList extends Component<HTMLDivElement,HTMLElement> implements DragTarget{
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
// Project Input
class ProjectInput extends Component<HTMLInputElement,HTMLInputElement>{
    
    titleEle: HTMLInputElement;
    descriptionEle: HTMLInputElement;
    peopleEle: HTMLInputElement;
    constructor(){
        super('project-input','app',true,`user-input`);
        
        // access form elements
        this.titleEle = this.elem.querySelector('#title')! as HTMLInputElement;
        this.descriptionEle = this.elem.querySelector('#description')! as HTMLInputElement;
        this.peopleEle = this.elem.querySelector('#people')! as HTMLInputElement;
        // to apply event listener to form
        this.configure();

    }
    configure(){
        this.elem.addEventListener('submit',this.submitHandler);
    }
    renderContent(): void {
        
    }
    private gatherInput():[string,string,number]|void{
        const title = this.titleEle.value;
        const description = this.descriptionEle.value;
        const people = this.peopleEle.value;
        const validatableTitle :Validateable = {
            value: title,
            required:true
        }
        const validatableDescription :Validateable = {
            value: description,
            required:true,
            minLength:5,
            maxLength:100
        }
        const validatablePeople :Validateable = {
            value: +people,
            required:true,
            min:0,
            max:5
        }
        if(!validate(validatableTitle) || !validate(validatableDescription) || !validate(validatablePeople)){
            alert('Invalid Input,please try again');
            return;
        }else{
            return [title,description,+people];
        }
    }
    private clearInput(){
        this.titleEle.value = '';
        this.descriptionEle.value = '';
        this.peopleEle.value = '';
    }
    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherInput();
        if(Array.isArray(userInput)){
            const [title,description,people] = userInput;
            projectState.addProject(title,description,people);
            // console.log(title,description,people);
        }
        this.clearInput();
    }
    
}
new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
}
