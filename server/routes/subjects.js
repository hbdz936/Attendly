const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Semester = require('../models/Semester');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/subjects
// @desc    Get all subjects for logged-in user (optional: filter by semester)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { semesterId } = req.query;
    
    const filter = { userId: req.userId };
    if (semesterId) {
      filter.semesterId = semesterId;
    }

    const subjects = await Subject.find(filter)
      .populate('semesterId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/subjects/:id
// @desc    Get single subject
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('semesterId', 'name');

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.json({
      success: true,
      subject
    });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/subjects
// @desc    Create new subject
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, type, semesterId, classesHeld, classesAttended, totalClasses } = req.body;

    // Validation
    if (!name || !semesterId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject name and semester'
      });
    }

    // Verify semester exists and belongs to user
    const semester = await Semester.findOne({
      _id: semesterId,
      userId: req.userId
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Create subject
    const subject = new Subject({
      userId: req.userId,
      semesterId,
      name,
      type: type || 'THEORY',
      totalClasses: totalClasses || null,
      classesHeld: classesHeld || 0,
      classesAttended: classesAttended || 0
    });

    await subject.save();

    // Populate semester name
    await subject.populate('semesterId', 'name');

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/subjects/:id
// @desc    Update subject
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, type, classesHeld, classesAttended, totalClasses } = req.body;

    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Update fields
    if (name) subject.name = name;
    if (type) subject.type = type;
    if (typeof totalClasses !== 'undefined') {
      subject.totalClasses = totalClasses > 0 ? totalClasses : null;
    }
    if (typeof classesHeld !== 'undefined') subject.classesHeld = Math.max(0, classesHeld);
    if (typeof classesAttended !== 'undefined') subject.classesAttended = Math.max(0, classesAttended);

    await subject.save();
    await subject.populate('semesterId', 'name');

    res.json({
      success: true,
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// 🔧 FIXED: @route   PATCH /api/subjects/:id/attendance
// @desc    Update attendance (increment/decrement)
// @access  Private
router.patch('/:id/attendance', async (req, res) => {
  try {
    const { attended } = req.body; // true = attended, false = bunked

    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // 🔧 CHECK: Don't allow marking attendance if totalClasses is reached
    if (subject.totalClasses && subject.classesHeld >= subject.totalClasses) {
      return res.status(400).json({
        success: false,
        message: `Cannot mark attendance: All ${subject.totalClasses} classes have been completed`
      });
    }

    // Increment classes held
    subject.classesHeld += 1;

    // Increment attended if present
    if (attended) {
      subject.classesAttended += 1;
    }

    await subject.save();
    await subject.populate('semesterId', 'name');

    res.json({
      success: true,
      message: attended ? 'Marked as attended' : 'Marked as bunked',
      subject
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/subjects/:id
// @desc    Delete subject
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    await Subject.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;