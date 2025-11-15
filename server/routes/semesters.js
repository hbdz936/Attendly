const express = require('express');
const router = express.Router();
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/semesters
// @desc    Get all semesters for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const semesters = await Semester.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      semesters
    });
  } catch (error) {
    console.error('Get semesters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/semesters/:id
// @desc    Get single semester
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const semester = await Semester.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    res.json({
      success: true,
      semester
    });
  } catch (error) {
    console.error('Get semester error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/semesters
// @desc    Create new semester
// @access  Private
router.post('/', async (req, res) => {
  try {
    console.log('Received semester creation request:', req.body);
    const { name, startDate, endDate } = req.body;

    // Validation
    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide semester name, start date, and end date'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Create semester
    const semester = new Semester({
      userId: req.userId,
      name,
      startDate: start,
      endDate: end
    });

    await semester.save();

    res.status(201).json({
      success: true,
      message: 'Semester created successfully',
      semester
    });
  } catch (error) {
    console.error('Create semester error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/semesters/:id
// @desc    Update semester
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    const semester = await Semester.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Update fields
    if (name) semester.name = name;
    if (startDate) semester.startDate = new Date(startDate);
    if (endDate) semester.endDate = new Date(endDate);

    // Validate dates if both are provided
    if (semester.endDate <= semester.startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    await semester.save();

    res.json({
      success: true,
      message: 'Semester updated successfully',
      semester
    });
  } catch (error) {
    console.error('Update semester error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/semesters/:id
// @desc    Delete semester and all its subjects
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const semester = await Semester.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Delete all subjects in this semester
    await Subject.deleteMany({ semesterId: req.params.id });

    // Delete semester
    await Semester.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Semester and all its subjects deleted successfully'
    });
  } catch (error) {
    console.error('Delete semester error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;