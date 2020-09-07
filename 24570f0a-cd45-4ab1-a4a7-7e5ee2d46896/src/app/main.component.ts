import { Component, OnInit } from '@angular/core';
import { GadgetService } from './gadget.service';
import { DSAService, PeriodRecord } from './service/dsa.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  loading: boolean;
  error: any;
  periodList: PeriodRecord[];

  constructor(
    private gadget: GadgetService,
    private dsa: DSAService) {
  }

  async ngOnInit() {

    try {
      this.loading = true;

      this.periodList = await this.dsa.getPeriodMappingTable();

    } catch (err) {
      this.error = err;
      console.log(err);
    } finally {

      this.loading = false;

  }

}
}
