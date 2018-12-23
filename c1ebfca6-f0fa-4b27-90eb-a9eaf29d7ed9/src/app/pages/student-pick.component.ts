import { ConfigService, AbsenceConf, PeriodConf } from './../service/config.service';
import { AlertService } from './../service/alert.service';
import { DSAService, Student, AttendanceItem, PeriodStatus, GroupType, RollCallCheck } from './../service/dsa.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPositionX } from '@angular/material/menu';
import { StudentCheck } from '../student-check';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GadgetService, Contract } from '../service/gadget.service';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'gd-student-pick',
  templateUrl: './student-pick.component.html',
  styleUrls: ['../common.css']
})
export class StudentPickComponent implements OnInit {

  contract: Contract;

  today: string;
  periodConf: PeriodConf; // 節次設定，決定有哪些缺曠可以點。
  selectedAbsence: string; // 已選擇的缺曠類別。
  groupInfo: { type: GroupType, id: string, name: string } // 課程或班級。
  studentChecks: StudentCheck[]; //點名狀態。
  checkSummary: string; // 目前點名狀態統計。

  isSendMessage: string;
  isSendClassRollCall: string;

  CanSend: boolean;
  displayedColumns: string[] = ['PeriodName', 'IsMessage', 'IsRollCall'];
  dataSource: any[];
  dataSource1: MatTableDataSource<any>;

  @ViewChild('t_message') viewMessage: TemplateRef<any>;
  @ViewChild('t_period') viewPeriod: TemplateRef<any>;

  constructor(
    private dsa: DSAService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private config: ConfigService,
    private change: ChangeDetectorRef,
    private router: Router,
    private gadget: GadgetService,
    private dialog: MatDialog
  ) {
    this.today = dsa.getToday();
  }

  async ngOnInit() {

    this.CanSend = true;
    this.groupInfo = { type: '', id: '', name: '' };

    await this.config.ready;
    this.route.paramMap.subscribe(async pm => {
      this.groupInfo.type = pm.get('type') as GroupType; // course or class
      this.groupInfo.id = pm.get('id'); // course id
      const period = pm.get('period'); // period name
      this.groupInfo.name = pm.get('name');

      // 可點節次。
      this.periodConf = this.config.getPeriod(period);
      this.periodConf.Absence = [].concat(this.periodConf.Absence || []);

      try {
        // 學生清單（含點名資料）。 
        await this.reloadStudentAttendances();


      } catch (error) {
        this.alert.json(error.message);
      }

      // 當有假別清單
      if (this.periodConf.Absence.length > 0) {
        //預設選第1個
        this.selectedAbsence = this.periodConf.Absence[0].Name;

        //是否支援推播功能
        this.isSendMessage = this.periodConf.Absence[0].IsSendMessage;
        //是否支援到離校通知
        this.isSendClassRollCall = this.periodConf.Absence[0].IsSendClassRollcall;

        //LOG功能
        if (this.isSendMessage == "t") {
          console.log("支援推播功能");
        } else if (this.isSendClassRollCall == "t") {
          console.log("支援到離校通知功能");
        } else {
          console.log("不支援推播功能");
        }
      }

      let Periods: PeriodConf[] = this.config.getPeriods();
      for (let p of Periods) {
        p.Absence = [].concat(p.Absence || []);
      }
      this.dataSource = [];
      console.log(Periods);
      for (let period of Periods) {
        if (period.Absence.length > 0) {

          let x: colper = <colper>{ PeriodName: period.Name, IsMessage: period.Absence[0].IsSendMessage, IsRollCall: period.Absence[0].IsSendClassRollcall };
          this.dataSource.push(x);

        }
      }


      this.dataSource1 = new MatTableDataSource(this.dataSource);

    });
  }

  /** 依目前以數載入缺曠資料。 */
  public async reloadStudentAttendances(msg?: string) {
    const students = await this.dsa.getStudents(this.groupInfo.type, this.groupInfo.id, this.today);
    this.studentChecks = [];

    const c = await this.gadget.getContract("1campus.dylan.teacher.test");
    const session = await c.send("DS.Base.Connect", { RequestSessionID: '' });
    console.log(session.SessionID);

    for (const stu of students) {

      // 取得學生照片 url
      stu.PhotoUrl = `${this.dsa.getAccessPoint()}/GetStudentPhoto?stt=Session&sessionid=${session.SessionID}&parser=spliter&content=StudentID:${stu.ID}`;
      const status = this.getSelectedAttendance(stu);
      this.studentChecks.push(new StudentCheck(stu, status, this.periodConf));

      // console.log(stu.PhotoUrl);
    }
    this.calcSummaryText();

    if (msg) this.alert.snack(msg);
  }

  changeAttendance(stu: StudentCheck) {

    if (!this.selectedAbsence) {
      this.alert.snack('請選擇假別！');
      return;
    }

    if (!stu.acceptChange()) {
      this.alert.snack('此學生無法調整缺曠。');
      return;
    }

    stu.setAttendance(this.selectedAbsence);

    this.calcSummaryText();

    //因為只是調整陣列中的某個元件資料，並不會引發畫面更新。
    // this.change.markForCheck();
  }

  /** 計算統計值。 */
  calcSummaryText() {
    const summary = new Map<string, number>();
    for (const check of this.studentChecks) {

      if (!check.acceptChange()) continue;
      if (!check.status) continue;

      if (!summary.has(check.status.AbsenceType)) {
        summary.set(check.status.AbsenceType, 0);
      }

      summary.set(check.status.AbsenceType, summary.get(check.status.AbsenceType) + 1);
    }

    let text: string[] = [];
    for (let k of Array.from(summary)) {
      text.push(`${k[0]}: ${k[1]}`);
    }

    this.checkSummary = text.join(', ');
  }

  getAttendanceText(stu: StudentCheck) {
    return stu.status ? stu.status.AbsenceType : '- -';
  }

  getAttendanceStyle(stu: StudentCheck) {

    let bgColor = 'rgba(255,255,255, 0.1)';
    let fgColor = 'rgba(0,0,0,0.5)';

    if (stu.status) {
      const absType = stu.status.AbsenceType;
      const absConf = this.config.getAbsence(absType);
      if (absConf.Abbr) {
        bgColor = this.config.getAbsenceColor(absConf.Abbr);
      }
      fgColor = 'white';
    }

    return {
      "background-color": bgColor,
      "color": fgColor,
    }
  }

  /**
   * 取得學生在目前節次的缺曠狀態。
   * @param stu 學生資料。
   */
  private getSelectedAttendance(stu: Student) {
    if (!stu.Attendance) return;
    const period = this.periodConf.Name;
    const dateAtts = [].concat(stu.Attendance.Period) as PeriodStatus[];
    return dateAtts.find(v => v['@text'] === period);
  }

  //開始儲存資料
  //若是第一節,則發送一則推播給家長
  //若是最後一節,也發送一則給家長
  async saveRollCall() {

    const items: RollCallCheck[] = [];

    for (const check of this.studentChecks) {
      items.push(check.getCheckData());
    }

    const dialog = this.alert.waiting("儲存中...");

    try {
      await this.dsa.setRollCall(this.groupInfo.type, this.groupInfo.id, this.periodConf.Name, items);
      // await this.reloadStudentAttendances();
      this.router.navigate(['/main']);
    } catch (error) {
      this.alert.json(error);
    } finally {

      dialog.close();
      // console.log(this.periodConf.Absence[0].IsSendMessage);

      //本節次是否能發送推播
      if (this.periodConf.Absence[0].IsSendClassRollcall == "t") {

        console.log("缺曠別:" + this.periodConf.Name + " 將會發送[到離校]推播");
        // console.log("導師自訂是否發送：" + this.CanSend);

        // 教師決定是否推送
        if (this.CanSend) {

          //整理學生資料
          for (let stud of this.studentChecks) {
            if (stud.status) {

              let message: string = `貴子弟『${stud.data.Name}』於『${this.today}』<br>節次『${this.periodConf.Name}』點名狀態為『${this.selectedAbsence}』<br>--已向校方請假可忽略此通知--<br>--感謝您關心孩子的最新狀態--`;
              stud._message = message;

            } else {

              let message: string = `貴子弟『${stud.data.Name}』於『${this.today}』<br>節次『${this.periodConf.Name}』點名狀態為『已到』<br>--感謝您關心孩子的最新狀態--`;
              stud._message = message;
            }
          }
          await this.SendMessage("課堂點名", this.studentChecks)

        }

      } else if (this.periodConf.Absence[0].IsSendMessage == "t") {

        console.log("缺曠別:" + this.periodConf.Name + " 將會發送[課堂點名]推播");
        // console.log("導師自訂是否發送：" + this.CanSend);

        // 教師決定是否推送
        if (this.CanSend) {

          //整理學生資料
          for (let stud of this.studentChecks) {
            if (stud.status) {

              let message: string = `貴子弟『${stud.data.Name}』於『${this.today}』<br>節次『${this.periodConf.Name}』點名狀態為『${this.selectedAbsence}』<br>--已向校方請假可忽略此通知--<br>--感謝您關心孩子的最新狀態--`;
              stud._message = message;

            } else {

              let message: string = `貴子弟『${stud.data.Name}』於『${this.today}』<br>節次『${this.periodConf.Name}』點名狀態為『已到』<br>--感謝您關心孩子的最新狀態--`;
              stud._message = message;
            }
          }
          await this.SendMessage("課堂點名", this.studentChecks)
        }

      } else {
        console.log("不需發送推播");
      }
    }
  }

  selectedAbsenceItem(abbr) {
    console.log(abbr);
    this.selectedAbsence = abbr.Name;
  }

  public async SendMessage(eTitle: string, students: StudentCheck[]) {

    const dialog = this.alert.waiting("訊息發送中...");
    try {

      this.contract = await this.gadget.getContract('1campus.notice.teacher.v17');

      for (let stud of students) {

        if (stud.status) {
          // <Request>
          // <Title>上課準備</Title>
          // <Message>明天上課請準備說故事</Message>
          // <TargetStudent>54156</TargetStudent><!--TargetStudent是通知對象學生的StudentID-->
          // </Request>
          const req: any = {
            Request: {
              Title: eTitle,
              Message: stud._message,
              TargetStudent: stud.data.ID
            }
          };

          //放此層,被點名者才會收到訊息
          const rsp = await this.contract.send('PushNotice', req);
        }
      }

      //整理資料後,放此層,所有學生收都會收到訊息

    } catch (error) {

      console.log(error);
      throw error;

    } finally {

      console.log("訊息發送完成!!");
      dialog.close();

    }
  }

  //顯示會發送的範本樣式
  private viewTemp1() {

    this.dialog.open(this.viewMessage);

  }

  //顯示支援發送點名推播的節次
  private viewTemp2() {

    this.dialog.open(this.viewPeriod);

  }
}

export class colper {

  public PeriodName: string;

  public IsMessage: string;

  public IsRollCall: string;
}

export interface AttendanceMessage {
  //標題
  Title: string;

  //訊息內容
  Message: string;

  //對象
  TargetStudent: string;
}