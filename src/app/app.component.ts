import { Component, OnInit, ViewChild } from '@angular/core';
import * as saveAs from 'file-saver';
import { WithdrawalService } from 'src/services/withdrawal.service';

export type data = {
  date: string;
  money: number;
  text: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public message = '';
  public dataArray: data[] = [];
  public commonArray: data[] = [];

  @ViewChild('data') data!: HTMLInputElement;

  constructor(private withdrawal: WithdrawalService) {}

  ngOnInit(): void {
    this.initArrays();
  }

  fileUpload(file: any) {
    let fileString = '';

    let reader = new FileReader();
    reader.onloadend = (e) => {
      fileString = reader.result as string;
    };
    reader.readAsText(file?.target?.files[0]);
    setTimeout(() => {
      this.seperateValues(fileString);
    }, 2000);
  }

  export() {
    const filtered = this.withdrawal.filterCommonFields(
      this.dataArray,
      this.commonArray
    );
    this.commonArray = filtered[0];
    this.dataArray = filtered[1];
    const totalArray = this.commonArray.concat(this.dataArray);
    let blob = new Blob([this.convertToCSV(totalArray)], {
      type: 'text/csv;charset=utf-8',
    });
    saveAs(blob, 'file.csv');
    this.initArrays();
  }

  private seperateValues(data: string) {
    const values = this.getDeposits(data);
    this.withdrawal.processWithdrawals(values[0] + values[1]);
    const withValues = this.withdrawal.parseWithdrawals();

    this.message = withValues[1] as string;
    this.dataArray = withValues[0] as data[];
  }

  getDeposits(data: string) {
    const startIndex = data.indexOf(`Date Amount Description`);
    const endIndex = data.indexOf(
      `Banking/Debit Card Withdrawals and Purchases`
    );
    const deposits = data.substring(startIndex + 24, endIndex);
    const withdrawals = data.substring(endIndex);
    return [deposits, withdrawals];
  }

  private convertToCSV(arr: any) {
    const array = [Object.keys(arr[0])].concat(arr);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join('\n');
  }

  private initArrays() {
    this.commonArray = [
      { date: '', money: 0, text: 'Rent' },
      { date: '', money: 0, text: 'Car Insurance' },
      { date: '', money: 0, text: 'Internet' },
      { date: '', money: 0, text: 'Electricity' },
      { date: '', money: 0, text: 'Rent Reporting' },
      { date: '', money: 0, text: 'Youtube' },
      { date: '', money: 0, text: 'Patreon' },
      { date: '', money: 0, text: 'Neflix' },
      { date: '', money: 0, text: 'Groceries' },
      { date: '', money: 0, text: 'Eating Out' },
      { date: '', money: 0, text: 'Pets' },
      { date: '', money: 0, text: 'Fun (Movies)' },
      { date: '', money: 0, text: 'Fun (Cards)' },
      { date: '', money: 0, text: 'Fun (Games)' },
      { date: '', money: 0, text: 'Haircut' },
      { date: '', money: 0, text: 'Medicine' },
      { date: '', money: 0, text: 'Paycheck' },
    ];
    this.dataArray = [];
    this.message = '';
  }
}
