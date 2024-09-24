import { TechCarReservModel } from "./tech-car-reserv";

export class AddTechCarReservModel {
    constructor(
        public token: string,
        public techReserv: AddTechCarReservPropModel
    ) { }
}
export class AddTechCarReservPropModel {
    constructor(
        public id: number,
        public order_date: string,
        public order_time: string,
        public order_download: string,
        public order_upload: string,
        public order_good: string,
        public order_note: string,
        public order_type: string
    ) { }
}