// Code goes here!
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
    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        console.log(this.titleEle.value);
    }
    private configure(){
        this.formElem.addEventListener('submit',this.submitHandler);
    }
    private attach(){
        this.hostElem.insertAdjacentElement('afterbegin',this.formElem);
    }
}
const prjEle = new ProjectInput();