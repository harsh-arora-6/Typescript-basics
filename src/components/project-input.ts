///<reference path = "base-component.ts" />
namespace App {
    // Project Input
export class ProjectInput extends Component<HTMLInputElement,HTMLInputElement>{
    
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
}