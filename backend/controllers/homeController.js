const homeService = require('../services/homeService');

exports.getStudentDashboard = async (req, res) => {
    try {
        const dashboard = await homeService.getStudentDashboard(req.user.userID);
        res.json(dashboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await homeService.getAlerts(req.user.userID);
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAdminDashboard = async (req, res) => {
    try {
        const dashboard = await homeService.getAdminDashboard(req.user.userID);
        res.json(dashboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
