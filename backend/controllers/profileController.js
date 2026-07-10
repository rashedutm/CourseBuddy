const profileService = require('../services/profileService');
const authService = require('../services/authService');

exports.getProgrammes = async (req, res) => {
    try {
        const programmes = await profileService.getAllProgrammes();
        res.json(programmes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await profileService.getFullProfile(req.user.userID);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.submitInitialSetup = async (req, res) => {
    try {
        const { programmeID, intakeID } = req.body;
        if (!programmeID || !intakeID) {
            return res.status(400).json({ error: 'Programme and intake are required' });
        }

        const existing = await profileService.getStudentByUserID(req.user.userID);
        if (existing) {
            return res.status(409).json({ error: 'Academic setup has already been completed' });
        }

        const user = await authService.getUserByID(req.user.userID);
        const studentID = `STU-${req.user.userID}`;

        await profileService.createStudentProfile(studentID, user.fullName, programmeID, intakeID, req.user.userID);

        res.status(201).json({ message: 'Academic setup complete', studentID, programmeID, intakeID });
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
            return res.status(400).json({ error: 'Invalid programme or intake selected' });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.updateName = async (req, res) => {
    try {
        const fullName = (req.body.fullName || '').trim();
        if (!fullName) {
            return res.status(400).json({ error: 'Full name is required' });
        }
        if (fullName.length > 100) {
            return res.status(400).json({ error: 'Full name must be under 100 characters' });
        }

        await profileService.updateFullName(req.user.userID, fullName);
        await profileService.syncStudentName(req.user.userID, fullName);

        res.json({ message: 'Name updated', name: fullName });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { programmeID, intakeID } = req.body;
        if (!programmeID || !intakeID) {
            return res.status(400).json({ error: 'Programme and intake are required' });
        }

        const existing = await profileService.getStudentByUserID(req.user.userID);
        if (!existing) {
            return res.status(404).json({ error: 'Complete initial academic setup first' });
        }

        await profileService.updateStudentProfile(req.user.userID, programmeID, intakeID);

        res.json({ message: 'Profile updated', programmeID, intakeID });
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
            return res.status(400).json({ error: 'Invalid programme or intake selected' });
        }
        res.status(500).json({ error: err.message });
    }
};
