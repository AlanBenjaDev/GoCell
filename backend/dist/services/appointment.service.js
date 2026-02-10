"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentService = exports.adminListAppointmentsService = exports.getAvailableHoursService = exports.createAppointmentFromPublicService = exports.createAppointmentService = void 0;
const db_1 = __importDefault(require("../config/db"));
const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(mins + minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toTimeString().slice(0, 5);
};
const createAppointmentService = async ({ user_id, pet_id, service_id, date, time, reason, dayOfWeek }) => {
    const [schedule] = await db_1.default.query(`SELECT start_time, end_time
     FROM work_schedules
     WHERE day_of_week = ? AND is_active = TRUE`, [dayOfWeek]);
    if (schedule.length === 0) {
        throw new Error("NO_WORK_SCHEDULE");
    }
    const { start_time, end_time } = schedule[0];
    if (time < start_time || time >= end_time) {
        throw new Error("OUTSIDE_WORKING_HOURS");
    }
    const [blocks] = await db_1.default.query(`SELECT 1
     FROM schedule_blocks
     WHERE block_date = ?
     AND (? BETWEEN start_time AND end_time)`, [date, time]);
    if (blocks.length > 0) {
        throw new Error("TIME_BLOCKED");
    }
    const [overlap] = await db_1.default.query(`SELECT 1
     FROM appointments
     WHERE appointment_date = ?
     AND appointment_time = ?`, [date, time]);
    if (overlap.length > 0) {
        throw new Error("TIME_TAKEN");
    }
    await db_1.default.query(`INSERT INTO appointments
     (user_id, pet_id, service_id, appointment_date, appointment_time, reason)
     VALUES (?, ?, ?, ?, ?, ?)`, [user_id, pet_id, service_id, date, time, reason ?? null]);
};
exports.createAppointmentService = createAppointmentService;
const createAppointmentFromPublicService = async ({ owner_name, phone, pet_name, date, time, reason, dayOfWeek }) => {
    const [users] = await db_1.default.query(`SELECT id FROM users WHERE phone = ? LIMIT 1`, [phone]);
    let user_id = users[0]?.id;
    if (!user_id) {
        const [result] = await db_1.default.query(`INSERT INTO users (user, phone) VALUES (?, ?)`, [owner_name, phone]);
        user_id = result.insertId;
    }
    const [pets] = await db_1.default.query(`SELECT id FROM pets WHERE name = ? AND user_id = ? LIMIT 1`, [pet_name, user_id]);
    let pet_id = pets[0]?.id;
    if (!pet_id) {
        const [result] = await db_1.default.query(`INSERT INTO pets (name, user_id) VALUES (?, ?)`, [pet_name, user_id]);
        pet_id = result.insertId;
    }
    const service_id = 1;
    await (0, exports.createAppointmentService)({
        user_id,
        pet_id,
        service_id,
        date,
        time,
        reason,
        dayOfWeek
    });
};
exports.createAppointmentFromPublicService = createAppointmentFromPublicService;
const getAvailableHoursService = async (date, dayOfWeek) => {
    const [schedule] = await db_1.default.query(`SELECT start_time, end_time
     FROM work_schedules
     WHERE day_of_week = ? AND is_active = TRUE`, [dayOfWeek]);
    if (schedule.length === 0) {
        return [];
    }
    const { start_time, end_time } = schedule[0];
    const slots = [];
    let current = start_time;
    while (current < end_time) {
        slots.push(current);
        current = addMinutes(current, 30);
    }
    const [appointments] = await db_1.default.query(`SELECT appointment_time
     FROM appointments
     WHERE appointment_date = ?`, [date]);
    const takenTimes = appointments.map((a) => a.appointment_time.slice(0, 5));
    const [blocks] = await db_1.default.query(`SELECT start_time, end_time
     FROM schedule_blocks
     WHERE block_date = ?`, [date]);
    const available = slots.filter((time) => {
        if (takenTimes.includes(time))
            return false;
        for (const block of blocks) {
            if (time >= block.start_time && time < block.end_time) {
                return false;
            }
        }
        return true;
    });
    return available;
};
exports.getAvailableHoursService = getAvailableHoursService;
const adminListAppointmentsService = async () => {
    const [appointments] = await db_1.default.query(`
      SELECT a.id, a.appointment_date, a.appointment_time, a.reason, a.status,
             u.user AS owner_name, p.name AS pet_name
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN pets p ON a.pet_id = p.id
      ORDER BY a.appointment_date, a.appointment_time
    `);
    return appointments;
};
exports.adminListAppointmentsService = adminListAppointmentsService;
const updateAppointmentService = async (id, status) => {
    await db_1.default.query(`UPDATE appointments SET status = ? WHERE id = ?`, [status, id]);
};
exports.updateAppointmentService = updateAppointmentService;
