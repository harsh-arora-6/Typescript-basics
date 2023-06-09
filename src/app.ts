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
            min:1,
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
            console.log(title,description,people);
        }
        this.clearInput();
    }
    private configure(){
        this.formElem.addEventListener('submit',this.submitHandler);
    }
    private attach(){
        this.hostElem.insertAdjacentElement('afterbegin',this.formElem);
    }
}
const prjEle = new ProjectInput();