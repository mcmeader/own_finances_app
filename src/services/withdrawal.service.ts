import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WithdrawalService {
  withdrawals: string = '';
  continue = false;

  processWithdrawals(data: string) {
    const values = this.getWithdrawals(data);
    this.withdrawals += values[0].toString();
    if (values[2] !== true) {
      this.processWithdrawals(values[1] as string);
    }
  }

  getWithdrawals(data: string) {
    const startIndex = data.indexOf(`Date Amount Description`);
    const endIndex = data.indexOf(
      `Banking/Debit Card Withdrawals and Purchases continued on next page`
    );
    const endIndex2 = data.indexOf(`Online and Electronic Banking Deductions`);
    let returnValues = ['', '', true];
    if (endIndex !== -1) {
      returnValues = [
        data.substring(startIndex + 24, endIndex).trim(),
        data.substring(endIndex + 68).trim(),
        false,
      ];
    } else {
      returnValues = [
        data.substring(startIndex + 24, endIndex2).trim(),
        data.substring(endIndex2 + 41).trim(),
        true,
      ];
    }
    return returnValues;
  }

  parseWithdrawals(deposits: string) {
    let dataArray = [];
    let message;
    let str = deposits + this.withdrawals;
    let index = 0;
    console.log('fff', str);
    do {
      const dateIndex = str.search(/\d\d\/\d\d\ /);
      const dateValue = str.match(/\d\d\/\d\d\ /);
      const dateLength = (dateValue && dateValue[0].length) || 0;

      const moneyIndex = str.search(/\d{1,}\.\d\d/);
      const moneyValue = str.match(/\d{1,}\.\d\d/);
      const moneyLength = (moneyValue && moneyValue[0].length) || 0;

      let currDate = str.substring(0, dateIndex + dateLength).trim();
      let currMoney = str
        .substring(dateIndex + dateLength, moneyIndex + moneyLength)
        .trim();
      str = str.substring(moneyIndex - 2);
      currMoney = currMoney.replace(',', '');

      const secondDateIndex = str.search(/\d\d\/\d\d/);
      let currName =
        secondDateIndex !== -1
          ? str.substring(moneyIndex + moneyLength, secondDateIndex).trim()
          : str.substring(moneyIndex + moneyLength).trim();

      str = str.substring(secondDateIndex);
      dataArray.push({
        date: currDate,
        money: Number(currMoney),
        text: currName,
      });
      if (index === 100) {
        message = 'Error!';
        setTimeout(() => (message = ''), 1000);
        break;
      }
      if (secondDateIndex === -1) {
        message = 'Added!';
        setTimeout(() => (message = ''), 1000);
        break;
      }
      index++;
    } while (true);
    return [dataArray, message];
  }

  filterCommonFields(dataArray: any[], commonArray: any[]) {
    dataArray.forEach((value, i) => {
      let remove = false;
      let text = value.text.toLowerCase();

      switch (true) {
        //Rent
        case text.includes('lake shore apart'):
          commonArray[0].money += value.money;
          remove = true;
          break;

        //Car Insurance
        case text.includes('progressive ins'):
          commonArray[1].money += value.money;
          remove = true;
          break;

        //Internet
        case text.includes('at&t'):
        case text.includes('att payment'):
          commonArray[2].money += value.money;
          remove = true;
          break;

        //Electricity
        case text.includes('dte energy'):
          commonArray[3].money += value.money;
          remove = true;
          break;

        //Rent Reporting
        case text.includes('renttrack'):
          commonArray[4].money += value.money;
          remove = true;
          break;

        //Youtube
        case text.includes('youtube'):
          commonArray[5].money += value.money;
          remove = true;
          break;

        //Patreon
        case text.includes('*patreon*'):
          commonArray[6].money += value.money;
          remove = true;
          break;

        //Netflix
        case text.includes('netflix'):
          commonArray[7].money += value.money;
          remove = true;
          break;

        //Groceries
        case text.includes('busch'):
        case text.includes('kroger'):
        case text.includes('walmart'):
        case text.includes('wm supercenter'):
        case text.includes('wal-mart'):
          commonArray[8].money += value.money;
          remove = true;
          break;

        //Fast Food
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
        case text.includes('goodylfe'):
          commonArray[9].money += value.money;
          remove = true;
          break;

        //Pets
        case text.includes('pet supplies'):
        case text.includes('petco'):
        case text.includes('city pets'):
          commonArray[10].money += value.money;
          remove = true;
          break;

        //Movies
        case text.includes('rave'):
        case text.includes('cinemark'):
          commonArray[11].money += value.money;
          remove = true;
          break;

        //Cards
        case text.includes('fun 4 all'):
          commonArray[12].money += value.money;
          remove = true;
          break;

        //Video Games
        case text.includes('steam purchase'):
        case text.includes('ninja kiwi'):
        case text.includes('black tree gam'):
          commonArray[13].money += value.money;
          remove = true;
          break;

        //Haircut
        case text.includes('lady janes'):
          commonArray[14].money += value.money;
          remove = true;
          break;

        //Medicine
        case text.includes('the women'):
        case text.includes('mi medicine'):
        case text.includes('cvs'):
          commonArray[15].money += value.money;
          remove = true;
          break;

        //Paycheck
        case text.includes('nexient'):
          commonArray[16].money += value.money;
          remove = true;
          break;
      }
      if (remove) {
        dataArray[i].text = '-';
      }
    });

    dataArray = dataArray.filter((data) => {
      return data.text !== '-';
    });

    return [commonArray, dataArray];
  }
}
