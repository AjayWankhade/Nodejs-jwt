const express=require('express');
const router=express.Router();

const authController=require('../controllers/authController')

router.get('/logout',authController.logout);
router.post('/login',authController.login);
router.get('/profile', authController.isAuthenticated, authController.profile);


// Route middleware to ensure user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.status(401).json({ message: 'Unauthorized' });
  }
  
  module.exports = router;