namespace App {
    type Listener<T> = (projects:T[])=>void
    class State<T>{
        // protected so that we can access it from inheriting class
        protected listeners: Listener<T>[] = [];
        addListener(listenerFn: Listener<T>){
            this.listeners.push(listenerFn);
        }
    }
    // Project State Management
    export class ProjectState extends State<Project>{
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
    export const projectState = ProjectState.getInstance();
}