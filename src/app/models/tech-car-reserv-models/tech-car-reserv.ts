export class TechCarReservModel {
    constructor(
        public id: number,
        public order_date: Date,
        public order_time: string,
        public order_download: string,
        public order_upload: string,
        public order_good: string,
        public order_note: string,
        public order_type: string
    ) { }
}
