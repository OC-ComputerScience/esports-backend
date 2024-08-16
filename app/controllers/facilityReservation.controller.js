import db from "../models/index.js";
import facilityReservationUtils from "../sequelizeUtils/facilityReservations.js";
import checkEventOverlap from "./support/reservationOverlapHelper.js";
import ReservationOverlap from "./support/reservationOverlapHelper.js";

const FacilityReservation = db.facilityReservation;
const Team = db.team;

const facilityReservationController = {};

// Create a new FacilityReservation
facilityReservationController.create = async (req, res) => {
  const {
    startTime,
    endTime,
    teamId,
    facilityStationId,
    reservationType,
    isOneTime,
  } = req.body;

  // Check if any of the required parameters are missing or empty
  if (
    !startTime ||
    !endTime ||
    !teamId ||
    !facilityStationId ||
    !reservationType ||
    isOneTime == undefined
  ) {
    return res.status(400).json({
      message:
        "All parameters (startTime, endTime, teamId, facilityStationId, reservationType, isOneTime) are required and cannot be empty!",
    });
  } else if (reservationType != "Match" && reservationType != "Practice") {
    return res.status(400).json({
      message:
        "Invalid Reservation Type! Valid types are 'Match' or 'Practice'",
    });
  }

  const newReservation = {
    startTime,
    endTime,
    teamId,
    facilityStationId,
    reservationType,
    isOneTime,
  };

  let eventOverlap = false;

  if (!isOneTime) {
    const { startDate, endDate, interval } = req.body;

    if (!startDate || !endDate || !interval) {
      return res.status(400).json({
        message:
          "Missing required params for recurrence. Params are: startDate, endDate, interval",
      });
    }

    const recurrence = {
      startDate,
      endDate,
      interval,
    };

    eventOverlap = await checkEventOverlap(newReservation, recurrence);
  } else {
    eventOverlap = await checkEventOverlap(newReservation);
  }

  if (eventOverlap) {
    return res.status(400).send({
      message: "Error Creating event: event overlaps with another event",
    });
  }

  FacilityReservation.create(newReservation)
    .then((facilityReservation) => {
      res.status(201).json(facilityReservation);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Unable to create FacilityReservation" });
    });
};

// Get all FacilityReservations for a specific facility station
facilityReservationController.getAllForFacilityStation = (req, res) => {
  const facilityStationId = req.params.facilityStationId;

  FacilityReservation.findAll({ where: { facilityStationId } })
    .then((facilityReservations) => {
      res.send(facilityReservations);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message || "Unable to fetch FacilityReservations" });
    });
};

facilityReservationController.getAllForDate = async (req, res) => {
  const { requestedDate, facilityStationId } = req.body;
  // let filteredEvents = [] // events to be returned

  // // Find all one-time events for the given date
  // const oneTimeEvents =   await FacilityReservation.findAll({
  //   where: {
  //     facilityStationId,
  //     isOneTime: {
  //       [Op.eq]: true
  //     },
  //     startTime: {
  //       [Op.gte]: requestedDate,
  //     },
  //     endTime: {
  //       [Op.lte]: moment(requestedDate).endOf('day').toDate(),
  //     },
  //   },
  //   include: [
  //     {
  //       model: Team,
  //       attributes: ['id','name', 'teamColor']
  //     }
  //   ]
  // })

  // filteredEvents = oneTimeEvents
  // console.log(oneTimeEvents)

  // // Find all recurring events for the given date
  // const recurringEvents = await FacilityReservation.findAll({
  //   where: {
  //     facilityStationId,
  //     isOneTime: {
  //       [Op.eq]: false
  //     },
  //   },
  //   include: [
  //     {
  //       model: RecurrenceRule,
  //       attributes: ['interval', 'startDate', 'endDate']
  //     },
  //     {
  //       model: Team,
  //       attributes: ['id','name', 'teamColor']
  //     }
  //   ]
  // })

  // recurringEvents.forEach((reservation) => {
  //   reservation.reservationRecurrenceRules.forEach((recurrenceRule) => {
  //     const eventStart = moment(recurrenceRule.startDate).startOf('day').utcOffset(0,true)
  //     const eventEnd = moment(recurrenceRule.endDate).startOf('day').utcOffset(0,true)
  //     const queryDate = moment(requestedDate).startOf('day').utcOffset(0,true)

  //     const eventInRange = moment(queryDate).isBetween(eventStart, eventEnd, undefined, '[]')
  //     if(eventInRange){
  //       const diffInWeeks = Math.abs(moment.duration(eventStart.diff(queryDate)).as("weeks"))

  //       if(Number.isInteger(diffInWeeks) && (diffInWeeks % recurrenceRule.interval) == 0){
  //         console.log(reservation)
  //         const {reservationRecurrenceRules, ...formattedEvent} = Object.assign({}, reservation.dataValues)
  //         filteredEvents.push(formattedEvent)
  //       }
  //     }
  //   })
  // })

  const events = await facilityReservationUtils.getAllReservationsForDate(
    facilityStationId,
    requestedDate,
  );
  res.status(200).send({ events: events });
};

// Get FacilityReservation by ID
facilityReservationController.getById = (req, res) => {
  const { id } = req.params;

  FacilityReservation.findByPk(id, {
    include: [
      {
        model: Team,
        attributes: ["id", "name", "teamColor"],
      },
    ],
  })
    .then(async (facilityReservation) => {
      if (!facilityReservation) {
        return res.status(404).json({ error: "FacilityReservation not found" });
      }
      const overlap = await ReservationOverlap(facilityReservation);
      console.log("Event Overlap:", overlap);
      res.status(200).json(facilityReservation);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message || "Unable to fetch FacilityReservation" });
    });
};

// Update FacilityReservation by ID
facilityReservationController.update = (req, res) => {
  const { id } = req.params;

  FacilityReservation.findByPk(id).then(async (facilityReservation) => {
    if (!facilityReservation) {
      return res.status(404).json({ error: "FacilityReservation not found" });
    }

    const { startTime, endTime, teamId, facilityStationId, isOneTime } =
      req.body;

    if (
      !startTime ||
      !endTime ||
      !teamId ||
      !facilityStationId ||
      isOneTime == undefined
    ) {
      res.status(400).send({ message: "Missing required parameters!" });
    } else {
      facilityReservation.startTime = startTime;
      facilityReservation.endTime = endTime;
      facilityReservation.teamId = teamId;
      facilityReservation.facilityStationId = facilityStationId;
      facilityReservation.isOneTime = isOneTime;

      const eventOverlap = await checkEventOverlap(facilityReservation);

      if (eventOverlap) {
        res
          .status(400)
          .send({ message: "Error: event overlaps with another event" });
      } else {
        facilityReservation
          .save()
          .then((response) => {
            res.status(200).send(response);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Unable to update FacilityReservation",
            });
          });
      }
    }
  });
};

// Delete FacilityReservation by ID
facilityReservationController.delete = (req, res) => {
  const { id } = req.params;

  FacilityReservation.findByPk(id)
    .then((facilityReservation) => {
      if (!facilityReservation) {
        return res.status(404).json({ error: "FacilityReservation not found" });
      } else {
        facilityReservation.destroy();
        return res
          .status(200)
          .json({ message: "FacilityReservation deleted successfully" });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: err.message || "Unable to delete FacilityReservation" });
    });
};

// Get all FacilityReservations by facilityStationId
facilityReservationController.getAllByFacilityStationId = (req, res) => {
  const { facilityStationId } = req.params;

  FacilityReservation.findAll({
    where: { facilityStationId },
    include: [
      {
        model: Team,
        attributes: ["id", "name", "teamColor"],
      },
    ],
  })
    .then((facilityReservations) => {
      res.send(facilityReservations);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message || "Unable to fetch FacilityReservations" });
    });
};

export default facilityReservationController;
