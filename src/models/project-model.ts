
// whether active project or finished project
export enum ProjectStatus {Active , Finished}
export class Project {
    // shorthand initialization
    constructor(public id:string,public title:string,public description:string,public people:number,public status:ProjectStatus){}
}

