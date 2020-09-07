import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaggingService {

//分頁相關屬性開始
currentPageNum:number=1;
totalPage:number=0;

pageNumArray:number[]=[];   //用以存放所有分頁的數字(3頁就會是1,2,3)
pageNumArrayMax:number=0;   //分頁數的陣列最大數
startPg:number=0;     //分頁陣列，開始的頁數
//分頁相關屬性結束

constructor() { }

//分頁相關開始
//  設定分頁控制項的陣列
set_pageNumArray(){
    //初始劃分頁陣列
      this.pageNumArray=[];
      let i:number=0;

      //計算起始頁
      this.startPg = Math.floor((this.currentPageNum-1)/10)*10+1;

      if(this.startPg+10>this.totalPage){
        this.pageNumArrayMax = this.totalPage;
      }
      else{
        this.pageNumArrayMax = this.startPg+10-1;
      }
      for(i=this.startPg;i<=this.pageNumArrayMax;i++){
          this.pageNumArray.push(i);
      }
}
//分頁相關結束
}
