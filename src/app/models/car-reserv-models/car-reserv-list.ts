export class CarReservListModel {
    constructor(
        public id: number,
        public reservDate: Date,
        public reservTime: string | any,
        public access?: string,
        public user?: string,
        public pointA?: string,
        public pointB?: string,
        public listId?: number
    ) { }
}