import moment from "moment";
import Calendar from "../../providers/Calender";
import { Event } from "@/@types/assignment";

export default function BasicCalendar({events}:{events:Event[]}) {

  
   return  <Calendar
   events={events}

 />
}