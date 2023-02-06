import { Injectable } from "@angular/core";

@Injectable()
export class DataService {
  getDetails() {
    const resultPromise = new Promise((res, rej) => {
      setTimeout(() => {
        res('data')
      }, 1.5 * 1000)
    })
    return resultPromise
  }
}
