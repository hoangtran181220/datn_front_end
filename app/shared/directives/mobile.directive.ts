import {Directive, ElementRef, HostListener, Input,} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: 'input[mobile]'
})
export class MobileDirective {
  constructor(private _el: ElementRef,private ngControl: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9+]*/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      this.ngControl.control.patchValue(this._el.nativeElement.value)
      event.stopPropagation();
    }
  }
}