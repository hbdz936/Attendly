const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['THEORY', 'PRACTICAL', 'TUTORIAL'],
    default: 'THEORY'
  },
  totalClasses: {
    type: Number,
    default: null,
    min: 0
  },
  classesHeld: {
    type: Number,
    default: 0,
    min: 0
  },
  classesAttended: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔧 FIXED: Virtual for attendance percentage
// When totalClasses is set, calculate against total, not held
subjectSchema.virtual('attendancePercentage').get(function() {
  // If totalClasses is set, use that as denominator
  if (this.totalClasses && this.totalClasses > 0) {
    return ((this.classesAttended / this.totalClasses) * 100).toFixed(1);
  }
  
  // Otherwise use classesHeld (original behavior)
  if (this.classesHeld === 0) return 0;
  return ((this.classesAttended / this.classesHeld) * 100).toFixed(1);
});

// Virtual for remaining classes
subjectSchema.virtual('remainingClasses').get(function() {
  if (!this.totalClasses) return null;
  return Math.max(0, this.totalClasses - this.classesHeld);
});

// Virtual for can reach target
subjectSchema.virtual('canReachTarget').get(function() {
  const targetPercentage = 75;
  
  // If no total classes set, assume can reach
  if (!this.totalClasses) return true;
  
  const remaining = this.remainingClasses;
  const maxPossibleAttended = this.classesAttended + remaining;
  const maxPossiblePercentage = (maxPossibleAttended / this.totalClasses) * 100;
  
  return maxPossiblePercentage >= targetPercentage;
});

// Virtual for best possible percentage
subjectSchema.virtual('bestPossiblePercentage').get(function() {
  if (!this.totalClasses) return 100;
  
  const remaining = this.remainingClasses;
  const maxPossibleAttended = this.classesAttended + remaining;
  return ((maxPossibleAttended / this.totalClasses) * 100).toFixed(1);
});

// 🔧 FIXED: Virtual for classes can miss (to maintain 75% attendance)
subjectSchema.virtual('canMiss').get(function() {
  const requiredPercentage = 75;
  
  // If total classes is set, calculate based on that
  if (this.totalClasses) {
    const requiredAttendance = Math.ceil((requiredPercentage / 100) * this.totalClasses);
    const canMiss = this.classesAttended - requiredAttendance;
    const remaining = this.remainingClasses;
    
    // Can't miss more than what's remaining
    return Math.max(0, Math.min(canMiss, remaining));
  }
  
  // Otherwise use current held classes
  const requiredAttendance = (requiredPercentage / 100) * this.classesHeld;
  const canMiss = Math.floor(this.classesAttended - requiredAttendance);
  return Math.max(0, canMiss);
});

// Virtual for must attend (to reach 75% attendance)
subjectSchema.virtual('mustAttend').get(function() {
  const requiredPercentage = 75;
  const currentPercentage = parseFloat(this.attendancePercentage);
  
  if (currentPercentage >= requiredPercentage) return 0;
  
  // If total classes is set, calculate based on remaining classes
  if (this.totalClasses) {
    const requiredTotal = Math.ceil((requiredPercentage / 100) * this.totalClasses);
    const stillNeed = requiredTotal - this.classesAttended;
    const remaining = this.remainingClasses;
    
    // If we need more than what's remaining, return remaining (it's impossible)
    return Math.min(stillNeed, remaining);
  }
  
  // Formula for when totalClasses is NOT set:
  // (attended + x) / (held + x) = 0.75
  // Solving for x: x = (0.75*held - attended) / 0.25
  const numerator = (requiredPercentage / 100) * this.classesHeld - this.classesAttended;
  const denominator = 1 - (requiredPercentage / 100);
  const mustAttend = Math.ceil(numerator / denominator);
  
  return Math.max(0, mustAttend);
});

// Virtual for must attend out of remaining (X out of Y format)
subjectSchema.virtual('mustAttendOutOfRemaining').get(function() {
  if (!this.totalClasses) return null;
  
  const requiredPercentage = 75;
  const requiredTotal = Math.ceil((requiredPercentage / 100) * this.totalClasses);
  const stillNeed = Math.max(0, requiredTotal - this.classesAttended);
  const remaining = this.remainingClasses;
  
  return {
    needed: Math.min(stillNeed, remaining),
    remaining: remaining,
    impossible: stillNeed > remaining
  };
});

// Ensure virtuals are included in JSON
subjectSchema.set('toJSON', { virtuals: true });
subjectSchema.set('toObject', { virtuals: true });

// Validate that attended <= held
subjectSchema.pre('save', function(next) {
  if (this.classesAttended > this.classesHeld) {
    next(new Error('Classes attended cannot exceed classes held'));
  }
  
  // Validate total classes
  if (this.totalClasses && this.classesHeld > this.totalClasses) {
    next(new Error('Classes held cannot exceed total classes in semester'));
  }
  
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);