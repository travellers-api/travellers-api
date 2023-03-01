export type Home = {
  hotelNumber: number;
  id: string;
  name: string;
  city: string;
  roomType: string;
  sex: string | null;
  tags: string[];
  calendar:
    | {
        date: string;
        vacancy: boolean | null;
      }[]
    | null;
  availables: string;
};
