import db from "../models/index.js";

const FacilityReservation = db.facilityReservation;
const RecurrenceRule = db.reservationRecurrenceRule;

const Op = db.Sequelize.Op;

const exports = {};

exports.getByReservationId = async (reservationId) => {
  return await RecurrenceRule.findOne({
    where: { facilityReservationId: reservationId },
  });
};

exports.getRulesInDateRange = async (startDate, endDate, stationId) => {
  return await RecurrenceRule.findAll({
    where: {
      [Op.or]: {
        [Op.or]: {
          startDate: { [Op.between]: [startDate, endDate] },
          endDate: { [Op.between]: [startDate, endDate] },
        },
        [Op.and]: {
          startDate: { [Op.lte]: startDate },
          endDate: { [Op.gte]: startDate },
        },
        [Op.and]: {
          startDate: { [Op.lte]: endDate },
          endDate: { [Op.gte]: endDate },
        },
      },
    },
    include: [
      {
        model: FacilityReservation,
        where: {
          facilityStationId: stationId,
        },
      },
    ],
  });
};

export default exports;
