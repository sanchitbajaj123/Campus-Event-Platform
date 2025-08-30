
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: String,
	email: { type: String, unique: true },
	password: String,
	role: String, // 'STUDENT', 'ORGANIZER', 'ADMIN'
});

const EventSchema = new mongoose.Schema({
	title: String,
	description: String,
	longDescription: String,
	date: String,
	location: String,
	organizer: String,
	imageUrl: String,
	maxCapacity: Number,
});

const RegistrationSchema = new mongoose.Schema({
	eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	status: String, // 'PENDING', 'APPROVED', 'REJECTED'
});

module.exports = {
	User: mongoose.model('User', UserSchema),
	Event: mongoose.model('Event', EventSchema),
	Registration: mongoose.model('Registration', RegistrationSchema),
};
