import { Component, OnInit } from '@angular/core';
import * as saveAs from 'file-saver';

export type data = {
  date: string,
  money: number,
  text: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public message = '';
  public dataArray: data[] = [];
  public commonArray: data[] = [];

  ngOnInit(): void {
    this.initArrays();
  }

  public clicked(data: string) {
    this.seperateValues(data);
  }

  public export() {
    this.filterCommonFields();
    const totalArray = this.commonArray.concat(this.dataArray);
    let blob = new Blob([this.convertToCSV(totalArray)], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "file.csv");
    this.initArrays()
  }

  private seperateValues(data: string) {
    let str = data;
    let index = 0;
    do {
      const dateIndex = str.search(/\d\d\/\d\d/);
      const dateValue = str.match(/\d\d\/\d\d/);
      const dateLength = dateValue && dateValue[0].length || 0;

      const moneyIndex = str.search(/\d{1,}\.\d\d/)
      const moneyValue = str.match(/\d{1,}\.\d\d/);
      const moneyLength = moneyValue && moneyValue[0].length || 0;

      let currDate = str.substring(0, dateIndex + dateLength).trim();
      let currMoney = str.substring(dateIndex + dateLength, moneyIndex + moneyLength).trim();
      str = str.substring(moneyIndex - 1);

      const secondDateIndex = str.search(/\d\d\/\d\d/);
      let currName = secondDateIndex !== -1 ?
        str.substring(moneyIndex + moneyLength, secondDateIndex).trim() :
        str.substring(moneyIndex + moneyLength).trim()

      str = str.substring(secondDateIndex);

      this.dataArray.push({ date: currDate, money: Number(currMoney), text: currName })
      if (index === 100) {
        this.message = 'Error!'
        setTimeout((() => this.message = ''), 1000);
        break;
      }
      if (secondDateIndex === -1) {
        this.message = 'Added!'
        setTimeout((() => this.message = ''), 1000);
        break;
      }
      index++
    } while (true);
  }

  private convertToCSV(arr: any) {
    const array = [Object.keys(arr[0])].concat(arr)

    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }

  private filterCommonFields() {
    this.dataArray.forEach((value, i) => {
      let remove = false;
      let text = value.text.toLowerCase();

      switch (true) {
        case text.includes('lake shore apart'):
          this.commonArray[0].money += value.money;
          remove = true;
          break;

        case text.includes('progressive ins'):
          this.commonArray[1].money += value.money;
          remove = true;
          break;

        case text.includes('at&t'):
        case text.includes('att payment'):
          this.commonArray[2].money += value.money;
          remove = true;
          break;

        case text.includes('dte energy'):
          this.commonArray[3].money += value.money;
          remove = true;
          break;

        case text.includes('renttrack'):
          this.commonArray[4].money += value.money;
          remove = true;
          break;

        case text.includes('youtube'):
          this.commonArray[5].money += value.money;
          remove = true;
          break;

        case text.includes('*patreon*'):
          this.commonArray[6].money += value.money;
          remove = true;
          break;

        case text.includes('netflix'):
          this.commonArray[7].money += value.money;
          remove = true;
          break;

        case text.includes('busch'):
        case text.includes('kroger'):
        case text.includes('walmart'):
        case text.includes('wm supercenter'):
        case text.includes('wal-mart'):
          this.commonArray[8].money += value.money;
          remove = true;
          break;

        case text.includes('five guys'):
        case text.includes('panda express'):
        case text.includes('china palace'):
        case text.includes('qdoba'):
        case text.includes('mcdonald'):
        case text.includes('taco bell'):
        case text.includes('wendy'):
        case text.includes('burger 1'):
        case text.includes('thai fresh cafe'):
        case text.includes('arby'):
        case text.includes('goodylfe smoothies'):
        case text.includes('pita'):
        case text.includes('wendy'):
        case text.includes('leftys cheese'):
        case text.includes('leftys famous cheese'):
        case text.includes('domino'):
        case text.includes('coldstone'):
        case text.includes('steak-nshake'):
        case text.includes('jersey mikes'):
        case text.includes('pizza hut'):
        case text.includes('burger king'):
        case text.includes('subway'):
        case text.includes('red robin'):
        case text.includes('pancheros'):
        case text.includes('dairy queen'):
        case text.includes('yp sichuan'):
        case text.includes('culver'):
        case text.includes('buffalo wild wings'):
        case text.includes('hamburgers'):
          case text.includes('tropical smoothie cafe'):
          case text.includes('kfc'):
          this.commonArray[9].money += value.money;
          remove = true;
          break;

        case text.includes('pet supplies'):
          case text.includes('petco'):
            case text.includes('city pets'):
          this.commonArray[10].money += value.money;
          remove = true;
          break;

        case text.includes('rave'):
          case text.includes('cinemark'):
          this.commonArray[11].money += value.money;
          remove = true;
          break;

        case text.includes('fun 4 all'):
          this.commonArray[12].money += value.money;
          remove = true;
          break;

        case text.includes('steam purchase'):
        case text.includes('ninja kiwi'):
        case text.includes('black tree gam'):
          this.commonArray[13].money += value.money;
          remove = true;
          break;

        case text.includes('lady janes'):
          this.commonArray[14].money += value.money;
          remove = true;
          break;

        case text.includes('the women'):
        case text.includes('mi medicine'):
        case text.includes('cvs'):
          this.commonArray[15].money += value.money;
          remove = true;
          break;
      }
      if (remove) {
        this.dataArray[i].text = '-'
      }
    });

    this.dataArray = this.dataArray.filter((data) => {
      return data.text !== '-';
    });

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
    ]
    this.dataArray = [];
    this.message = '';
  }
}