export class Info {
  info?: MiscInfo;
  titles?: Titles;

  constructor(info?: MiscInfo, titles?: Titles) {
    this.info = info;
    this.titles = titles;
  }
}

class MiscInfo {
  numberOfPeople?: Number;
  licensePlates?: String[];

  constructor(numberOfPeople?: Number, licensePlates?: String[]) {
    this.numberOfPeople = numberOfPeople;
    this.licensePlates = licensePlates;
  }
}

class Titles {
  presentation?: String;
  lunchTalk?: String;
  workshop?: String;

  constructor(presentation?: String, workshop?: String, lunchTalk?: String) {
    this.presentation = presentation;
    this.workshop = workshop;
    this.lunchTalk = lunchTalk;
  }
}
