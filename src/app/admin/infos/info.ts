export class Info {
    info?: MiscInfo;
    titles?: Titles;
}

class MiscInfo {
    numberOfPeople?: Number;
    licensePlates?: String[];
}

class Titles {
    presentation?: String;
    lunchTalk?: String;
    workshop?: String;
}