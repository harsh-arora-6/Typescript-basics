// Code goes here!
class ProjectInput {
    projectElem: HTMLTemplateElement;
    hostElem: HTMLDivElement;
    formElem: HTMLFormElement;
    titleEle: HTMLInputElement;
    descriptionEle: HTMLInputElement;
    peopleEle: HTMLInputElement;
    constructor(){
        this.projectElem = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElem = document.getElementById('app')! as HTMLDivElement;
        // reference to child of template element
        const importedNode = document.importNode(this.projectElem.content,true);
        this.formElem = importedNode.firstElementChild as HTMLFormElement;
        this.formElem.id = 'user-input';
        // access form elements
        this.titleEle = this.formElem.querySelector('#title')! as HTMLInputElement;
        this.descriptionEle = this.formElem.querySelector('#description')! as HTMLInputElement;
        this.peopleEle = this.formElem.querySelector('#people')! as HTMLInputElement;
        // to apply event listener to form
        this.configure();
        // render form inside app div
        this.attach();
    }
    private submitHandler(event: Event){
        event.preventDefault();
        console.log(this.titleEle.value);
    }
    private configure(){
        this.formElem.addEventListener('submit',this.submitHandler.bind(this));
    }
    private attach(){
        this.hostElem.insertAdjacentElement('afterbegin',this.formElem);
    }
}
const prjEle = new ProjectInput();