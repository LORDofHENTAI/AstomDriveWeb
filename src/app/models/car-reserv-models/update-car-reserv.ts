import { CarReservDetailsModel } from "./car-reserv-deatails";
import { CarReservListModel } from "./car-reserv-list";

export class UpdateCarReservModel {
    constructor(
        public token: string,
        public carReservModel: CarReservListModel,
        public carReservDetails: CarReservDetailsModel[]
    ) { }
}