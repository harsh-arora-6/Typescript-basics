namespace App{
     // create a decorator to auto bind the submit handler to 'this'
// first parameter is target,second is methodName but we used _ to begin the parameter name as we don't have any use of them and we want typescript to 
// not give any error or we can set noUnusedParameters to false in tsconfig.json
export function autobind(_:any,_2:string,descriptor:PropertyDescriptor){
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
}