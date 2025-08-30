
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Event, Registration } = require('./schema');
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });

// User routes
app.post('/api/signup', async (req, res) => {
	try {
		const user = new User({ ...req.body, role: 'STUDENT' });
		await user.save();
		res.json(user);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});
app.post('/api/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email, password });
	if (user) res.json(user);
	else res.status(401).json({ error: 'Invalid credentials' });
});
app.get('/api/users', async (req, res) => res.json(await User.find()));

// Allow admin to create organizers or users with any role
app.post('/api/users', async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.json(user);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});
app.delete('/api/users/:id', async (req, res) => {
	await User.findByIdAndDelete(req.params.id);
	await Registration.deleteMany({ userId: req.params.id });
	res.json({ success: true });
});

// Event routes
app.get('/api/events', async (req, res) => res.json(await Event.find()));
app.post('/api/events', async (req, res) => {
	const event = new Event(req.body);
	await event.save();
	res.json(event);
});
app.delete('/api/events/:id', async (req, res) => {
	await Event.findByIdAndDelete(req.params.id);
	await Registration.deleteMany({ eventId: req.params.id });
	res.json({ success: true });
});

// Registration routes
app.get('/api/registrations', async (req, res) => res.json(await Registration.find()));
// Populated registrations route used by frontend (returns event and user objects inside each registration)
app.get('/api/registrations/populated', async (req, res) => {
	try {
		const regs = await Registration.find().populate('userId').populate('eventId');
		// normalize to same shape frontend expects (userId and eventId may be objects)
		const normalized = regs.map(r => ({
			_id: r._id,
			eventId: r.eventId,
			userId: r.userId,
			status: r.status,
		}));
		res.json(normalized);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});
app.post('/api/registrations', async (req, res) => {
	const reg = new Registration(req.body);
	await reg.save();
	res.json(reg);
});
app.patch('/api/registrations/:id', async (req, res) => {
	const reg = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
	res.json(reg);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
