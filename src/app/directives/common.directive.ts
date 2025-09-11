import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: '[numberOnly]'

})
export class NumberOnlyDirective {

  constructor(public el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initvalue = this.el.nativeElement.value;
    this.el.nativeElement.value = initvalue.replace(/[^0-9]*/g, '');
    if (initvalue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
};

@Directive({
  selector: '[alphabetOnly]'
})
export class AlphabetOnlyDirective {
  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^a-zA-Z, ]/, '');
    input.value = sanitized;
  }

};

