import express from 'express';
import { getRecentlyViewed, updateProfile, resetPassword, addOrUpdateNote, getUserNotes, getProfileImage } from '../controllers/userController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/recently-viewed', protect, getRecentlyViewed);
router.put('/profile', protect, upload.single('profilePic'), updateProfile);
router.get('/profile-image', protect, getProfileImage)
router.put('/reset-password', protect, resetPassword);
router.post('/note', protect, addOrUpdateNote);
router.get('/notes', protect, getUserNotes);

export default router;
