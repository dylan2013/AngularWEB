import { Component, OnInit } from '@angular/core';
import { CourseObj, ClassObj, DSAService, CourseConf } from '../service/dsa.service';
import { ActivatedRoute } from '@angular/router';
import { DataCacheService } from '../service/data-cache.service';
import { MatDialog } from '@angular/material';
import { PeriodChooserComponent } from '../modal/period-chooser.component';

@Component({
  selector: 'gd-course-selc',
  templateUrl: './course-selc.component.html',
  styles: []
})
export class CourseSelcComponent implements OnInit {

  jClass: ClassObj; // 課程或班級。
  className: string;
  today: string;

  constructor(
    private dsa: DSAService,
    private route: ActivatedRoute,
    private cache: DataCacheService,
    private dialog: MatDialog) {
    this.today = dsa.getToday();

    //所選的班級
    console.log(cache.selectedClass);

    this.jClass = cache.selectedClass;
    this.className = this.jClass.ClassName;
  }

  ngOnInit() {
  }

  //開啟節次點名介面
  async openPicker(course: CourseConf) {
    // console.log(course);
    this.dialog.open(PeriodChooserComponent, {
      data: { course: course },
    });
  }
}
