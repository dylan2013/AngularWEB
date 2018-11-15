import { Injectable } from '@angular/core';
import { CourseObj, GradeYearObj, ClassObj } from './dsa.service';
import { GadgetService, Contract } from './gadget.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataCacheService {

  constructor() {
  }

  public selectedClass: ClassObj;
}

