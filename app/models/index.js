import { Sequelize } from "sequelize";

import user from "./user.model.js";
import session from "./session.model.js";
import title from "./title.model.js";
import alias from "./alias.model.js";
import team from "./team.model.js";
import emergencyContact from "./emergencyContact.model.js";
import role from "./role.model.js";
import userRole from "./userrole.model.js";
import match from "./match.model.js";
import matchParticipant from "./matchParticipant.model.js";
import metric from "./metric.model.js";
import matchData from "./matchData.model.js";
import playerData from "./playerData.model.js";

import form from "./form.model.js";
import formVersion from "./formVersion.model.js";
import formVersionField from "./formVersionField.model.js";
import userFormSignature from "./userFormSignature.model.js";

import facilityReservation from "./facilityReservation.model.js";
import reservationRecurrenceRule from "./reservationRecurrenceRule.model.js";
import facilityStation from "./facilityStation.model.js";

const db = {};

db.user = user;
db.session = session;
db.title = title;
db.alias = alias;
db.team = team;
db.emergencyContact = emergencyContact;
db.role = role;
db.userRole = userRole;
db.match = match;
db.matchParticipant = matchParticipant;
db.metric = metric;
db.matchData = matchData;
db.playerData = playerData;

db.form = form;
db.formVersion = formVersion;
db.formVersionField = formVersionField;
db.userFormSignature = userFormSignature;

db.facilityReservation = facilityReservation;
db.reservationRecurrenceRule = reservationRecurrenceRule;
db.facilityStation = facilityStation;

db.Sequelize = Sequelize;

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// foreign key for emergency contact
db.user.hasMany(
  db.emergencyContact,
  { as: "emergencyContact" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);
db.emergencyContact.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// foreign key for alias
db.user.hasMany(
  db.alias,
  { as: "alias" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);
db.alias.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// Foreign key for team in alias
db.team.hasMany(
  db.alias,
  { as: "alias" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// Foreign key for title in team
db.title.hasMany(
  db.team,
  { as: "team" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// Foreign key for user in user role
db.user.hasMany(
  db.userRole,
  { as: "userRole" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

db.userRole.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// Foreign key for role in user role
db.role.hasMany(
  db.userRole,
  { as: "userRole" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

db.userRole.belongsTo(db.role, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

// Match relationships
db.team.hasMany(
  db.match,
  { as: "match" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);
db.match.belongsTo(
  db.team,
  { as: "team" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// FK for title in metric
db.title.hasMany(
  db.metric,

  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// MatchData relationships
db.match.hasMany(
  db.matchData,
  { as: "matchData" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

db.matchData.belongsTo(
  db.match,
  { as: "match" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

db.metric.hasMany(
  db.matchData,
  { as: "matchData" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

db.matchData.belongsTo(
  db.metric,
  { as: "metric" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// FK for alias in matchParticipant
db.alias.hasMany(db.matchParticipant, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

// tells matchParticipant that it can pull from the alias model
db.matchParticipant.belongsTo(db.alias, { foreignKey: "aliasId" });

// FK for match in matchParticipant
db.matchParticipant.belongsTo(db.match, { foreignKey: "matchId" });

// FK for alias in matchParticipant
db.matchParticipant.hasMany(db.playerData, {
  foreignKey: { name: "participantId", allowNull: false },
  onDelete: "CASCADE",
});

// FK for alias in matchParticipant
db.metric.hasMany(db.playerData, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});
db.playerData.belongsTo(db.metric, { foreignKey: "metricId" });

db.user.hasMany(db.userFormSignature, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.userFormSignature.belongsTo(db.user, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.form.hasMany(db.formVersion, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.formVersion.belongsTo(db.form, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.formVersion.hasMany(db.userFormSignature, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.userFormSignature.belongsTo(db.formVersion, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.formVersion.hasMany(db.formVersionField, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.formVersionField.belongsTo(db.formVersion, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.team.hasMany(db.facilityReservation, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.facilityStation.hasMany(db.facilityReservation, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.facilityReservation.belongsTo(db.facilityStation, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.facilityReservation.belongsTo(db.team, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.facilityReservation.hasMany(db.reservationRecurrenceRule, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

db.reservationRecurrenceRule.belongsTo(db.facilityReservation, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

export default db;
