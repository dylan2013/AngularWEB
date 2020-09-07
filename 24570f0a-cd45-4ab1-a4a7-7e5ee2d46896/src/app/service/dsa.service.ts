import { Injectable } from '@angular/core';
import { GadgetService, Contract } from 'src/app/gadget.service';

export class DSAService {

  private ready: Promise<void>;

  private contract: Contract;

  constructor(private gadget: GadgetService) {
    this.ready = this.initContract();
  }

  private async initContract() {
    try {
      this.contract = await this.gadget.getContract('ta');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getPeriodMappingTable() {
    await this.ready;

    const rsp = await this.contract.send('TeacherAccess.GetPeriodMappingTable');
    return [].concat(rsp.Response && rsp.Response.PeriodRecord || []).map(function (item) { return item as PeriodRecord; });
  }
}

/**
 * 班級課程項目。
 */
export interface PeriodRecord {
  Aggregated: string; // 比例
  Name: string; // 名稱
  Sort: string; // 排序
  Type: number; // 類別
}
