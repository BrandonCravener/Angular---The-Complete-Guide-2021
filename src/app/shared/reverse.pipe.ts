import { Pipe } from "@angular/core";

@Pipe({
  name: 'reverse'
})
export class ReversePipe {
  transform(val: string) {
    return val.split('').reverse().join('')
  }
}
