import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UsernameValidaor {

    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {

        if(!control.value || (control.value && control.value.length === 0) || (control.value && control.value.length > 0 && (control.value as string).indexOf(' ') >= 0)){

            return {cannotContainSpace: true}

        }

        return null;

    }

}
