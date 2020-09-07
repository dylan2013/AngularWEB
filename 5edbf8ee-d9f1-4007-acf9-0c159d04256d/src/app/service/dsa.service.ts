import { Contract } from './gadget.service';
import { Injectable } from '@angular/core';
import { GadgetService } from './gadget.service';

@Injectable()
export class DSAService {

  private ready: Promise<void>;

  private contract: Contract;

  constructor(private gadget: GadgetService) {
    this.ready = this.initContract();
  }

  private async initContract() {
    try {
      this.contract = await this.gadget.getContract('Body.Temperature.Student');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * 取得體溫紀錄
   */
  public async getMyTemperature() {
    await this.ready;

    const rsp = await this.contract.send('GetMyTemperatureList');
    return [].concat(rsp.Response && rsp.Response.BodyRecord || []).map(function (item) { return item as BodyTemperatureRecord; });
  }


  public getAccessPoint() {
    return this.contract.getAccessPoint;
  }

}

/**
 * 班級課程項目。
 */
export interface BodyTemperatureRecord {
  LastUpdate: string
  UID: string;
  BodyTag: string; //是老師還是學生
  BodyTemperature: number; //體溫(數字)
  Category: string; //量測類別
  Location: string; //地點
  MeasurementMethod: string;
  OccurDate: string; //量測日期
  RefObjId: string; //系統編號
  Remark: string; //備註
}