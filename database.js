const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

// Mongoose Schemas
const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  whatsapp: { type: String, trim: true, default: '' },
  github: { type: String, trim: true, default: '' },
  expertise: { type: String, trim: true, default: '' },
  experience: { type: Number, default: 0 },
  message: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      return ret;
    }
  }
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
});

const Applicant = mongoose.models.Applicant || mongoose.model('Applicant', applicantSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// In-memory fallback if MongoDB is not reachable
let inMemoryApplicants = [];
let inMemoryAdmins = [
  {
    id: 'admin-1',
    username: 'admin',
    // default sha256 for 'admin123'
    password: crypto.createHash('sha256').update('admin123').digest('hex')
  }
];

let isConnected = false;

// Connect to MongoDB
async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!mongoUri) {
    console.warn('\n⚠️ [MongoDB] No MONGODB_URI found in environment variables.');
    console.warn('ℹ️  Running with in-memory database fallback for development.\n');
    isConnected = false;
    return false;
  }

  try {
    console.log('[MongoDB] Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('✅ [MongoDB] Connected successfully.');

    // Seed default admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultHash = crypto.createHash('sha256').update('admin123').digest('hex');
      await Admin.create({
        username: 'admin',
        password: defaultHash
      });
      console.log('ℹ️ [MongoDB] Initialized default admin account: admin / admin123');
    }

    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`\n⚠️ [MongoDB] Connection failed (${error.message}).`);
    console.warn('ℹ️  Running with in-memory database fallback so web server remains active.\n');
    return false;
  }
}

// Get all applicants (with optional status filter)
async function getAllApplicants(status) {
  if (isConnected && mongoose.connection.readyState === 1) {
    const filter = status ? { status } : {};
    const applicants = await Applicant.find(filter).sort({ created_at: -1 });
    return applicants.map(a => a.toJSON());
  }

  // Fallback
  let results = [...inMemoryApplicants];
  if (status) {
    results = results.filter(a => a.status === status);
  }
  return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// Get applicant by ID
async function getApplicantById(id) {
  if (isConnected && mongoose.connection.readyState === 1) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const applicant = await Applicant.findById(id);
    return applicant ? applicant.toJSON() : null;
  }

  // Fallback
  return inMemoryApplicants.find(a => a.id === id || a._id === id) || null;
}

// Add new applicant
async function addApplicant(applicantData) {
  const { name, email, whatsapp, github, expertise, experience, message } = applicantData;

  if (isConnected && mongoose.connection.readyState === 1) {
    const applicant = new Applicant({
      name,
      email,
      whatsapp,
      github,
      expertise,
      experience: Number(experience) || 0,
      message,
      status: 'pending'
    });
    const saved = await applicant.save();
    console.log('Nouveau candidat inscrit (MongoDB):', saved.name);
    return saved.toJSON();
  }

  // Fallback
  const newApplicant = {
    id: 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    _id: 'app_' + Date.now(),
    name,
    email: email.toLowerCase(),
    whatsapp: whatsapp || '',
    github: github || '',
    expertise: expertise || '',
    experience: Number(experience) || 0,
    message: message || '',
    status: 'pending',
    created_at: new Date()
  };

  inMemoryApplicants.push(newApplicant);
  console.log('Nouveau candidat inscrit (In-Memory Fallback):', newApplicant.name);
  return newApplicant;
}

// Check existing email
async function checkExistingEmail(email) {
  const normalizedEmail = (email || '').toLowerCase().trim();

  if (isConnected && mongoose.connection.readyState === 1) {
    const count = await Applicant.countDocuments({ email: normalizedEmail });
    return count > 0;
  }

  // Fallback
  return inMemoryApplicants.some(a => a.email.toLowerCase() === normalizedEmail);
}

// Update applicant status
async function updateApplicantStatus(id, status) {
  if (isConnected && mongoose.connection.readyState === 1) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const applicant = await Applicant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return applicant ? applicant.toJSON() : null;
  }

  // Fallback
  const applicant = inMemoryApplicants.find(a => a.id === id || a._id === id);
  if (applicant) {
    applicant.status = status;
    return applicant;
  }
  return null;
}

// Authenticate Admin
async function authenticateAdmin(username, password) {
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  if (isConnected && mongoose.connection.readyState === 1) {
    const admin = await Admin.findOne({ username, password: hashedPassword });
    if (!admin) return null;
    return { id: admin._id.toString(), username: admin.username };
  }

  // Fallback
  const admin = inMemoryAdmins.find(
    a => a.username === username && a.password === hashedPassword
  );
  if (!admin) return null;
  return { id: admin.id, username: admin.username };
}

module.exports = {
  initDatabase,
  addApplicant,
  getAllApplicants,
  getApplicantById,
  checkExistingEmail,
  updateApplicantStatus,
  authenticateAdmin,
  isDbConnected: () => isConnected && mongoose.connection.readyState === 1
};
