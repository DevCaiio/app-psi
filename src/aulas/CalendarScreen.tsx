import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import { Icon } from "@mui/material";
import Avatar from "@mui/material/Avatar";

import { cn } from "../utils/utils";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ICalendar,
  IEvents,
  getCalendarsEndpoint,
  getEventsEndpoint,
} from "./backend";

const DAYS_OF_WEEKS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

export function CalendasScreen() {
  const [events, setEvents] = useState<IEvents[]>([]);
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarsSelected, setCalendarsSelected] = useState<boolean[]>([]);
  const weeks = generateCalendar(
    getToday(),
    events,
    calendars,
    calendarsSelected
  );
  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([
      getCalendarsEndpoint(),
      getEventsEndpoint(firstDate, lastDate),
    ]).then(([calendars, events]) => {
      setCalendarsSelected(calendars.map(() => true));
      setCalendars(calendars);
      setEvents(events);
    });
  }, [firstDate, lastDate]);

  function toggleCalendar(i: number) {
    const newValue = [...calendarsSelected];
    newValue[i] = !newValue[i];
    setCalendarsSelected(newValue);
  }
  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box borderRight="1px solid rgb(224,224,224)" width="15em" padding="16px">
        <h2 className="text-3x1 font-bold mb-5">Agenda Psi. Gabriele</h2>
        <Button variant="contained" size="small">
          Nova Agenda
        </Button>
        <Box marginTop="50px">
          <h3 className="text-2x1 font-semibold">Agendas</h3>
          {calendars.map((calendar, i) => (
            <div>
              <FormControlLabel
                key={calendar.id}
                control={
                  <Checkbox
                    style={{ color: calendar.color }}
                    checked={calendarsSelected[i]}
                    onChange={() => toggleCalendar(i)}
                  />
                }
                label={calendar.name}
              />
            </div>
          ))}
        </Box>
      </Box>

      <Box flex={1} display={"flex"} flexDirection={"column"}>
        <Box display={"flex"} alignItems={"center"} padding={"8px 16px"}>
          <Box>
            <IconButton aria-label="Mês Anterior">
              <Icon>chevron_left</Icon>
            </IconButton>
            <IconButton aria-label="Proximo Mês">
              <Icon>chevron_right</Icon>
            </IconButton>
          </Box>
          <Box flex={1} marginLeft={"16px"} component={"strong"}>
            Junho de 2024
          </Box>
          <IconButton aria-label="Avatar">
            <Avatar>
              <Icon>person</Icon>
            </Avatar>
          </IconButton>
        </Box>
        <TableContainer component={Paper} style={{ flex: 1 }}>
          <Table
            className={cn("bg-gray-100")}
            sx={{
              tableLayout: "fixed",
              minHeight: "100%",
              borderTop: "1px solid rgb(224,224,224)",
              "& td ~ td, & th ~ th": {
                borderLeft: "1px solid rgb(224,224,224)",
              },
              "& td": {
                verticalAlign: "top",
                overflowX: "hidden",
                padding: "8px 4px",
              },
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                {DAYS_OF_WEEKS.map((day) => (
                  <TableCell align="center" key={day}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeks.map((week, i) => (
                <TableRow key={i}>
                  {week.map((cell) => (
                    <TableCell align="center" key={cell.date}>
                      <div className="font-medium mb-1"> {cell.dayOfMonth}</div>

                      {cell.events.map((event) => {
                        const color = event.calendar.color;
                        return (
                          <button
                            key={event.id}
                            className="text-left whitespace-nowrap flex items-center"
                          >
                            {event.time && (
                              <>
                                <Icon fontSize="inherit" style={{ color }}>
                                  watch_later
                                </Icon>
                                <Box component={"span"} margin={"0 4px"}>
                                  {event.time}
                                </Box>
                              </>
                            )}
                            {event.time ? (
                              <span>{event.desc}</span>
                            ) : (
                              <span
                                className="text-white rounded inline-block"
                                style={{
                                  backgroundColor: color,
                                  padding: "2px 4px",
                                }}
                              >
                                {event.desc}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

type IEventWhitCalendar = IEvents & { calendar: ICalendar };

interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWhitCalendar[];
}

function generateCalendar(
  date: string,
  allEvents: IEvents[],
  calendars: ICalendar[],
  calendarSelected: boolean[]
): ICalendarCell[][] {
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + "T12:00:00");
  const currentMonth = jsDate.getMonth();

  const currentDay = new Date(jsDate.valueOf());
  currentDay.setDate(1);
  const dayOfWeek = currentDay.getDay();

  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];
    for (let i = 0; i < DAYS_OF_WEEKS.length; i++) {
      const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, "0");
      const dayStr = currentDay.getDate().toString().padStart(2, "0");
      const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`;

      const events: IEventWhitCalendar[] = [];
      for (const event of allEvents) {
        if (event.date === isoDate) {
          const callIndex = calendars.findIndex(
            (cal) => cal.id === event.calendarId
          );
          if (calendarSelected[callIndex]) {
            events.push({ ...event, calendar: calendars[callIndex] });
          }
        }
      }
      week.push({
        date: isoDate,
        dayOfMonth: currentDay.getDate(),
        events,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}

function getToday() {
  return "2021-06-17";
}
