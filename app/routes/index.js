import { Router } from "express";
import AliasRoutes from "./alias.routes.js";
import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";
import TitleRoutes from "./title.routes.js";
import TeamRoutes from "./team.routes.js";
import EmergencyContactRoutes from "./emergencyContact.routes.js";
import RoleRoutes from "./role.routes.js";
import UserRoleRoutes from "./userrole.routes.js";
import MatchRoutes from "./match.routes.js";
import MetricRoutes from "./metric.routes.js";
import MatchDataRoutes from "./matchData.routes.js";
import PlayerDataRoutes from "./playerData.routes.js";
import MatchParticipantRoutes from "./matchParticpant.routes.js";

import ChartDataRotues from "./chartDataRoutes.js";

import FormRoutes from "./form.routes.js";
import FormVersionRoutes from "./formVersion.routes.js";
import FormSignatureRoutes from "./userFormSignature.routes.js";

import FacilityReservation from "./facilityReservation.routes.js";
import ReservationRecurrenceRule from "./reservationRecurrenceRule.routes.js";
import FacilityStation from "./facilityStation.routes.js";

const router = Router();

router.use("/user", UserRoutes);
router.use("/alias", AliasRoutes);
router.use("/user", EmergencyContactRoutes);

router.use("/", AuthRoutes);
router.use("/titles", TitleRoutes);
router.use("/teams", TeamRoutes);
router.use("/role", RoleRoutes);
router.use("/userrole", UserRoleRoutes);
router.use("/match", MatchRoutes);
router.use("/metrics", MetricRoutes);
router.use("/matchData", MatchDataRoutes);
router.use("/playerData", PlayerDataRoutes);
router.use("/matchParticipant", MatchParticipantRoutes);

router.use("/chartData", ChartDataRotues);

router.use("/forms", FormRoutes);
router.use("/forms", FormVersionRoutes);
router.use("/formSignatures", FormSignatureRoutes);

router.use("/facility/reservations/", FacilityReservation);
router.use("/facility/reservationRecurrence/", ReservationRecurrenceRule);
router.use("/facility/stations/", FacilityStation);

export default router;
