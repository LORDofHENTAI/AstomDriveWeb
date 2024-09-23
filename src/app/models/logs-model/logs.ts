export class LogsModel {
    constructor(
        public id: number,
        public action: string,
        public user: string,
        public actionDate: Date,
        public comment: string
    ) { }
}