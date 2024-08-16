import FacilityReservationUtils from "../../sequelizeUtils/facilityReservations.js";
import RecurrenceRule from "../../sequelizeUtils/reservationRecurrenceRule.js";
import moment from "moment-timezone";

const checkEventOverlap = async (newReservation, recurrence) => {
  //console.log(newReservation)
  const { startTime, endTime, facilityStationId } = newReservation;

  console.log("isOneTime:", newReservation.isOneTime);
  /* -- Check Recurrence Overlap -- */
  if (!newReservation.isOneTime) {
    if (!recurrence) {
      recurrence = await RecurrenceRule.getByReservationId(newReservation.id);
    }
    const recurrenceDates = generateRecurrenceInstancesFromRule(recurrence);

    let eventOverlaps = false;

    for (let i = 0; i < recurrenceDates.length; i++) {
      const instanceDate = recurrenceDates[i];

      const events = (
        await FacilityReservationUtils.getAllReservationsForDate(
          facilityStationId,
          instanceDate.toISOString(),
        )
      ).map((reservation) => {
        return updateReservationDate(
          reservation,
          instanceDate.format("YYYY-MM-DD"),
        );
      });

      const instanceEvent = {
        id: newReservation.id,
        startTime: getDateTimeForRecurrenceInstace(startTime, instanceDate),
        endTime: getDateTimeForRecurrenceInstace(endTime, instanceDate),
      };

      const overlap = checkEventOverlapsList(instanceEvent, events);
      if (overlap) {
        eventOverlaps = true;
      }
    }

    return eventOverlaps;
  } else {
    /* -- Check One Time Event -- */
    const events = await FacilityReservationUtils.getAllReservationsForDate(
      facilityStationId,
      moment(startTime).startOf("day").toISOString(),
    );
    return checkEventOverlapsList(newReservation, events);
  }
};

const checkEventOverlapsList = (eventToCheck, eventList) => {
  let doesNewEventOverlap = false;

  const startTime = moment(eventToCheck.startTime);
  const endTime = moment(eventToCheck.endTime);

  eventList.forEach((event) => {
    const eventStartTime = moment(event.startTime);
    const eventEndTime = moment(event.endTime);

    if (event.id != eventToCheck.id) {
      if (
        isStartTimeInInterval(startTime, eventStartTime, eventEndTime) ||
        isEndTimeInInterval(endTime, eventStartTime, eventEndTime) ||
        (startTime.isBefore(eventStartTime) && endTime.isAfter(eventEndTime))
      ) {
        doesNewEventOverlap = true;
      }
    }
  });
  return doesNewEventOverlap;
};

const isStartTimeInInterval = (timeToCheck, intervalStart, intervalEnd) => {
  const startTime = moment(intervalStart);
  const endTime = moment(intervalEnd);
  const checkTime = moment(timeToCheck);

  let isBetween = checkTime.isBetween(startTime, endTime, "[)");

  if (checkTime.isSame(startTime)) isBetween = true;

  return isBetween;
};

const isEndTimeInInterval = (timeToCheck, intervalStart, intervalEnd) => {
  const startTime = moment(intervalStart);
  const endTime = moment(intervalEnd);
  const checkTime = moment(timeToCheck);

  return checkTime.isBetween(startTime, endTime, "[)");
};

const generateRecurrenceInstancesFromRule = (recurrenceRule) => {
  const { startDate, endDate, interval } = recurrenceRule;
  const eventInstances = [];
  let currentDate = moment(startDate).startOf("day").utcOffset(-6);

  const endMoment = moment(endDate).startOf("day").utcOffset(-6);

  while (currentDate.isSameOrBefore(endMoment, "day")) {
    eventInstances.push(currentDate.clone());
    currentDate.add(interval, "weeks");
  }

  return eventInstances;
};

const getDateTimeForRecurrenceInstace = (originalDateTime, instanceDate) => {
  const dateTime = moment(originalDateTime);

  const newDate = moment(instanceDate).set({
    hour: dateTime.hour(),
    minute: dateTime.minute(),
    second: dateTime.second(),
  });

  return newDate;
};

const updateReservationDate = (reservation, newDate) => {
  const { startTime, endTime } = reservation;

  // Parse the new date
  const newStartDate = moment(newDate).startOf("day");

  // Extract the time from the original startTime and endTime
  const originalStartTime = moment(startTime);
  const originalEndTime = moment(endTime);

  // Create new startTime and endTime with the new date and original times
  const newStartTime = newStartDate.clone().set({
    hour: originalStartTime.hour(),
    minute: originalStartTime.minute(),
    second: originalStartTime.second(),
  });

  const newEndTime = newStartTime.clone().set({
    hour: originalEndTime.hour(),
    minute: originalEndTime.minute(),
    second: originalEndTime.second(),
  });

  // Return the updated reservation object
  return {
    ...reservation,
    startTime: newStartTime.toISOString(),
    endTime: newEndTime.toISOString(),
  };
};

export default checkEventOverlap;
