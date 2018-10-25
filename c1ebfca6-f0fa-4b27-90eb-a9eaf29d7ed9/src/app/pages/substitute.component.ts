import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DSAService, GradeYearObj } from '../service/dsa.service';
import { ConfigService } from '../service/config.service';
import { GadgetService } from '../service/gadget.service';
import { AlertService } from '../service/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gd-substitute',
  templateUrl: './substitute.component.html',
  styles: []
})
export class SubstituteComponent implements OnInit {

  loading: boolean;
  gradeAndCourse;
  today: string; // 今日。

  gradeYeares : GradeYearObj[];
  yearColumns: string[] = ['GradeYear'];
  courseColumns: string[] = ['Period'];

  constructor(private dsa: DSAService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private config: ConfigService,
    private change: ChangeDetectorRef,
    private gadget: GadgetService) {

    this.today = dsa.getToday();

  }

  async ngOnInit() {
    this.Init();

  }

  async Init() {
    this.loading = true;
    try {
      await this.config.ready;

      this.gradeYeares = await this.dsa.getAllCourse();

      console.log(this.gradeYeares);

    } catch (error) {
      this.alert.json(error);
    } finally {
      this.loading = false;
    }

  }

}
