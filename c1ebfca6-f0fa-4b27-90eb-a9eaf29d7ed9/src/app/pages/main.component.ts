import { ConfigService } from './../service/config.service';
import { PeriodChooserComponent } from './../modal/period-chooser.component';
import { AlertService } from './../service/alert.service';
import { DebugComponent } from './../modal/debug.component';
import { DSAService, RollCallRecord, SuggestRecord } from './../service/dsa.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'gd-main',
  templateUrl: './main.component.html',
  styleUrls: ['../common.css']
})
export class MainComponent implements OnInit {

  //頁面分為三頁,今日課程,建議點名,調代課程
  currPage: 'Today' | 'Course' | 'Substitute' = 'Today';
  courseColumns: string[] = ['Name', 'Type', 'Students'];
  suggestColumns: string[] = ['Checked', 'CourseID', 'CourseName', 'Period'];
  loading: boolean;

  today: string; // 今日。
  suggests: SuggestRecord[]; // 今加建議點名。
  courses: RollCallRecord[]; //課程清單。


  constructor(
    private dsa: DSAService,
    private alert: AlertService,
    private dialog: MatDialog,
    private router: Router,
    private config: ConfigService
  ) { }

  async ngOnInit() {
    this.loading = true;
    try {

      //等待是否完成設定值的下載
      await this.config.ready;

      //
      this.today = this.dsa.getToday();

      //取得老師班級課程清單
      this.courses = await this.dsa.getCCItems();
      console.log(this.courses);

      //取的建議點名課程清單(傳入日期)
      this.suggests = await this.dsa.getSuggestRollCall(this.dsa.getToday());
      console.log(this.suggests);

      // this.alert.json(this.suggests);

    } catch (error) {
      this.alert.json(error);
    } finally {
      this.loading = false;
    }
  }

  async openPicker(course: RollCallRecord) {

    this.dialog.open(PeriodChooserComponent, {
      data: { course: course },
    });
  }

  async openSuggest(suggest: SuggestRecord) {

    // await this.alert.json(suggest)
    //   .afterClosed()
    //   .toPromise();

    this.router.navigate(['../pick', 'Course', suggest.CourseID, suggest.Period], {
      queryParams: { DisplayName: suggest.CourseName }
    });
  }
}
