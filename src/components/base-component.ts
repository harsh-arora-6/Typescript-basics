namespace App {
    export abstract class Component<T extends HTMLElement,U extends HTMLElement>{
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
}