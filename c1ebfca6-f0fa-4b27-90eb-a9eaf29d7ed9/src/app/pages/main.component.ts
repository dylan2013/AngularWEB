import { ConfigService } from './../service/config.service';
import { PeriodChooserComponent } from './../modal/period-chooser.component';
import { AlertService } from './../service/alert.service';
import { DebugComponent } from './../modal/debug.component';
import { DSAService, RollCallRecord, SuggestRecord, PeriodConf, AbsenceConf, Schedule, CourseConf } from './../service/dsa.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { SubstituteComponent } from './substitute.component';

@Component({
  selector: 'gd-main',
  templateUrl: './main.component.html',
  styleUrls: ['../common.css']
})
export class MainComponent implements OnInit {

  //頁面分為三頁,今日課程,建議點名,調代課程
  courseColumns: string[] = ['CourseName'];
  scheduleColumns: string[] = ['Period', 'Name', 'StudentCount', 'Checked'];
  loading: boolean;

  today: string; // 今日。
  periodConfs: PeriodConf[];
  conf;

  constructor(
    private dsa: DSAService,
    private alert: AlertService,
    private dialog: MatDialog,
    private router: Router,
    private config: ConfigService
  ) { }

  async ngOnInit() {
    await this.Init();
  }

  async Init() {
    this.loading = true;
    try {

      //等待是否完成設定值的下載
      await this.config.ready;

      this.today = this.dsa.getToday();
      this.conf = await this.dsa.getSchedule(this.today);

    } catch (error) {
      this.alert.json(error);
    } finally {
      this.loading = false;
    }
  }

  //開啟學生清單介面
  async openSchedule(schedule: Schedule) {

    // await this.alert.json(suggest)
    //   .afterClosed()
    //   .toPromise();
    console.log(schedule);

    const md1 = schedule.ClassID ? 'Class' : 'Course';
    const md2 = schedule.ClassID ? schedule.ClassID : schedule.CourseID;
    const md3 = schedule.Period;

    this.router.navigate(['../pick', md1, md2, md3], {
      queryParams: { DisplayName: schedule.CourseName }
    });
  }

  //開啟節次點名介面
  async openPicker(course: CourseConf) {

    console.log(course);

    this.dialog.open(PeriodChooserComponent, {
      data: { course: course },
    });
  }

  //開啟代課清單
  async openSubstitute() {
    this.router.navigate(['../sub']); 
  }
}
