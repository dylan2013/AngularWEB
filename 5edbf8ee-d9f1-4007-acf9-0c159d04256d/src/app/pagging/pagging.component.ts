import { Router} from '@angular/router';
import { PaggingService } from '../service/pagging.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagging-component',
  templateUrl: './pagging.component.html',
  styleUrls: ['./pagging.component.css']
})
export class PaggingComponent implements OnInit {

  constructor(public svcPagging:PaggingService,private router:Router) { }

  ngOnInit() {
  }

  //設定第幾頁，透過queryParams傳遞第幾個分頁
  setPgNum(pgNum:number){
    this.svcPagging.currentPageNum = pgNum;
    this.router.navigate(['prod'],{queryParams:{pgNum:pgNum}});
  }

  //設定分頁的筆數，透過queryParams傳遞第幾個分頁，分頁的筆數
  setPgSize(){
    this.router.navigate(
      ['prod'],
      {
        queryParams:{
          pgNum:this.svcPagging.currentPageNum,
        }
      }
    );
  }

}