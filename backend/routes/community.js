import express from 'express';
import CommunityMember from  '../models/communityMembers.js';
import verifyToken from '../verifyToken.js';

const router = express.Router();

// Join Community
router.post('/join', verifyToken, async (req, res) => {
  try {
    const existing = await CommunityMember.findOne({ userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already joined!' });

    const member = await CommunityMember.create({ userId: req.user.id });
    if(!member){
        return res.status(400).json({ message: 'Failed joined to community' });
    }
    res.status(200).json({ msg: 'Joined community successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all community members (optional)
router.get('/members', async (req, res) => {
    console.log("inside here")
  try {
    const members = await CommunityMember.find().populate("userId");
    console.log(members)
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
