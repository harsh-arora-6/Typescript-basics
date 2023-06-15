namespace App {
    export interface Validateable {
        value:string | number;
        required?:boolean;
        minLength?:number;
        maxLength?:number;
        min?:number;
        max?:number;
    }
    export function validate(validateableObj: Validateable){
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
}