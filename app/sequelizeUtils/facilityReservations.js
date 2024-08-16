import db from "../models/index.js";
import moment from "moment";

const FacilityReservation = db.facilityReservation;
const RecurrenceRule = db.reservationRecurrenceRule;
const Team = db.team;
const Op = db.Sequelize.Op;

const getAllReservationsForDate = async (facilityStationId, requestedDate) => {
  let filteredEvents = []; // events to be returned

  // Find all one-time events for the given date
  const oneTimeEvents = await FacilityReservation.findAll({
    where: {
      facilityStationId,
      isOneTime: {
        [Op.eq]: true,
      },
      startTime: {
        [Op.gte]: moment(requestedDate).startOf("day").toDate(),
      },
      endTime: {
        [Op.lte]: moment(requestedDate).endOf("day").toDate(),
      },
    },
    include: [
      {
        model: Team,
        attributes: ["id", "name", "teamColor"],
      },
    ],
  });

  filteredEvents = oneTimeEvents.map((event) => {
    return event.dataValues;
  });

  // Find all recurring events for the given date
  const recurringEvents = await FacilityReservation.findAll({
    where: {
      facilityStationId,
      isOneTime: {
        [Op.eq]: false,
      },
    },
    include: [
      {
        model: RecurrenceRule,
        attributes: ["interval", "startDate", "endDate"],
      },
      {
        model: Team,
        attributes: ["id", "name", "teamColor"],
      },
    ],
  });

  recurringEvents.forEach((reservation) => {
    reservation.reservationRecurrenceRules.forEach((recurrenceRule) => {
      const eventStart = moment(recurrenceRule.startDate)
        .startOf("day")
        .utcOffset(0, true);
      const eventEnd = moment(recurrenceRule.endDate)
        .startOf("day")
        .utcOffset(0, true);
      const queryDate = moment(requestedDate).startOf("day").utcOffset(0, true);

      const eventInRange = moment(queryDate).isBetween(
        eventStart,
        eventEnd,
        undefined,
        "[]",
      );
      if (eventInRange) {
        const diffInWeeks = Math.abs(
          moment.duration(eventStart.diff(queryDate)).as("weeks"),
        );

        if (
          Number.isInteger(diffInWeeks) &&
          diffInWeeks % recurrenceRule.interval == 0
        ) {
          // eslint-disable-next-line
          const { reservationRecurrenceRules, ...formattedEvent } =
            Object.assign({}, reservation.dataValues);
          filteredEvents.push(formattedEvent);
        }
      }
    });
  });

  return filteredEvents;
};

export default { getAllReservationsForDate };
