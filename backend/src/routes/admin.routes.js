const express = require('express');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

function validateCreateCharity(body) {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    errors.push({ message: 'Name is required', field: 'name' });
  }
  return { value: body, errors };
}

function validateWinnerStatus(body) {
  const errors = [];
  if (!['approved', 'rejected', 'paid'].includes(body.status)) {
    errors.push({ message: "Status must be one of 'approved', 'rejected', or 'paid'", field: 'status' });
  }
  return { value: body, errors };
}

router.use(verifyToken, requireAdmin);
router.get('/users', adminController.getUsers);
router.patch('/users/:id', adminController.updateUser);
router.get('/subscriptions', adminController.getSubscriptions);
router.get('/dashboard', adminController.getDashboardStats);
router.post('/charities', validate(validateCreateCharity), adminController.createCharity);
router.patch('/charities/:id', adminController.updateCharity);
router.delete('/charities/:id', adminController.deleteCharity);
router.get('/contributions', adminController.getContributions);
router.patch('/winners/:id/status', validate(validateWinnerStatus), adminController.updateWinnerStatus);

module.exports = router;
