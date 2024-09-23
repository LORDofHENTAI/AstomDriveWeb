export class CarDetailModel {
    constructor(
        public id: number,
        public user: string,
        public timeStart: string,
        public timeEnd: string,
        public reservDate: string
    ) { }
}