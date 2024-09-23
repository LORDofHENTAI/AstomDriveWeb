import { CarReservDetailsModel } from "./car-reserv-deatails";

export class AddCarReservModel {
    constructor(
        public token: string,
        public date: string,
        public time: string,
        public user: string,
        public details: CarReservDetailsModel[]
    ) { }
}