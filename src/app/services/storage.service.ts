import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  key = 'mc-rc-config';

  value: any = {
    host: 'localhost'
  };

  constructor() {
    const val = localStorage.getItem(this.key);
    if (val === null) {
      this.setValue(this.value);
    } else {
      this.setValue(this.value);
    }
  }

  setValue(value: any) {
    localStorage.setItem(this.key, JSON.stringify(value));
    this.value = this.getValue();
  }

  getValue() {
    const val = localStorage.getItem(this.key);
    if (val !== null) {
      this.value = JSON.parse(val);
      return this.value;
    }
    return null;
  }
}
