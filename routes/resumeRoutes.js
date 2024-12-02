// routes/resumeRoutes.js
const express = require('express');
const Resume = require('../models/Resume');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.options('/:id', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authMiddlewareorization');
  res.status(200).send();
});


// Create a new resume
router.post('/', authMiddleware, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id // Add the user ID from the authMiddlewareenticated session
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating resume',
      error: error.message
    });
  }
});

// Get all resumes for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: resumes
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
      error: error.message
    });
  }
});

// Get a specific resume by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resume',
      error: error.message
    });
  }
});

// Update a resume
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating resume',
      error: error.message
    });
  }
});

// Delete a resume
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resume',
      error: error.message
    });
  }
});

module.exports = router;