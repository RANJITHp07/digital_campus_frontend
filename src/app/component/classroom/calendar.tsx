import moment from "moment";
import Calendar from "../../providers/Calender";

const events = [
  {
    start: moment("2023-11-19T10:00:00").toDate(),
    end: moment("2023-11-19T11:00:00").toDate(),
    title: "MRI Registration",
  },
  {
    start: moment("2023-11-19T14:00:00").toDate(),
    end: moment("2023-11-22T15:30:00").toDate(),
    title: "ENT Appointment",
  },
];

export default function BasicCalendar() {
   return  <Calendar
   events={events}
   max={moment("2023-11-18T18:00:00").toDate()}
   min={moment("2023-11-19T08:00:00").toDate()}
 />
}