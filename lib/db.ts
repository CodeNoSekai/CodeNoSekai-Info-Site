import mongoose from 'mongoose';
import crypto from 'crypto';
import dns from 'dns';

// Fix for MongoDB Atlas SRV query resolution on local ISP DNS
try {
  dns.setServers([
    '1.1.1.1',
    '1.0.0.1',
    '8.8.8.8',
    '8.8.4.4',
  ]);
  dns.setDefaultResultOrder('ipv4first');
} catch (err) {
  // Ignore in environments where setting DNS is restricted
}

export interface ApplicantRecord {
  id: string;
  _id?: string;
  name: string;
  email: string;
  whatsapp: string;
  github: string;
  expertise: string;
  experience: number;
  message: string;
  status: string;
  created_at: string | Date;
}

const applicantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    whatsapp: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    expertise: { type: String, trim: true, default: '' },
    experience: { type: Number, default: 0 },
    message: { type: String, default: '' },
    status: {
      type: String,
      default: 'submitted',
    },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        if (ret._id) {
          ret.id = ret._id.toString();
        }
        return ret;
      },
    },
  }
);

// Prevent re-compilation of model in Next.js hot reload
const ApplicantModel =
  mongoose.models.Applicant || mongoose.model('Applicant', applicantSchema);

// In-memory store for fallback if MongoDB is not connected
const globalForDb = globalThis as unknown as {
  inMemoryApplicants?: ApplicantRecord[];
};

if (!globalForDb.inMemoryApplicants) {
  globalForDb.inMemoryApplicants = [
    {
      id: 'app-seed-1',
      name: 'Kenji Sato',
      email: 'kenji.dev@example.com',
      whatsapp: '+819012345678',
      github: 'kenji-sato',
      expertise: 'fullstack',
      experience: 3,
      message: 'Excited to contribute to CodeNoSekai open source bots and community tools!',
      status: 'submitted',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'app-seed-2',
      name: 'Amina El-Sayed',
      email: 'amina.cloud@example.com',
      whatsapp: '+201012345678',
      github: 'amina-dev',
      expertise: 'backend',
      experience: 5,
      message: 'Would love to help scale your API infrastructures and collaborate on Node/Go services.',
      status: 'submitted',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

const inMemoryApplicants = globalForDb.inMemoryApplicants;

let isConnected = false;

export async function connectToDatabase(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!mongoUri) {
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    return true;
  } catch (err: any) {
    console.warn(`[MongoDB] Connection failed: ${err.message}. Using in-memory fallback.`);
    isConnected = false;
    return false;
  }
}

export async function checkExistingEmail(email: string): Promise<boolean> {
  const normalized = (email || '').toLowerCase().trim();
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      const count = await ApplicantModel.countDocuments({ email: normalized });
      return count > 0;
    } catch {
      // fallback to memory
    }
  }

  return inMemoryApplicants.some((a) => a.email.toLowerCase() === normalized);
}

export async function addApplicant(data: {
  name: string;
  email: string;
  whatsapp?: string;
  github?: string;
  expertise?: string;
  experience?: number;
  message?: string;
}): Promise<ApplicantRecord> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      const record = new ApplicantModel({
        name: data.name,
        email: data.email.toLowerCase().trim(),
        whatsapp: data.whatsapp || '',
        github: data.github || '',
        expertise: data.expertise || '',
        experience: Number(data.experience) || 0,
        message: data.message || '',
        status: 'submitted',
      });
      const saved = await record.save();
      return saved.toJSON() as ApplicantRecord;
    } catch (e) {
      console.warn('[MongoDB] Save failed, fallback to memory', e);
    }
  }

  const newApplicant: ApplicantRecord = {
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name,
    email: data.email.toLowerCase().trim(),
    whatsapp: data.whatsapp || '',
    github: data.github || '',
    expertise: data.expertise || '',
    experience: Number(data.experience) || 0,
    message: data.message || '',
    status: 'submitted',
    created_at: new Date().toISOString(),
  };

  inMemoryApplicants.unshift(newApplicant);
  return newApplicant;
}

export async function getAllApplicants(): Promise<ApplicantRecord[]> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      const docs = await ApplicantModel.find({}).sort({ created_at: -1 });
      return docs.map((d) => d.toJSON() as ApplicantRecord);
    } catch (e) {
      console.warn('[MongoDB] Query failed, fallback to memory', e);
    }
  }

  return [...inMemoryApplicants].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getApplicantById(id: string): Promise<ApplicantRecord | null> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await ApplicantModel.findById(id);
        return doc ? (doc.toJSON() as ApplicantRecord) : null;
      }
    } catch (e) {
      // fallback
    }
  }

  return inMemoryApplicants.find((a) => a.id === id) || null;
}

export async function deleteApplicant(id: string): Promise<boolean> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await ApplicantModel.findByIdAndDelete(id);
        if (deleted) return true;
      }
      const res = await ApplicantModel.deleteOne({ _id: id });
      if (res.deletedCount > 0) return true;
    } catch (e) {
      console.warn('[MongoDB] Delete failed, trying memory fallback', e);
    }
  }

  const initialLength = inMemoryApplicants.length;
  const filtered = inMemoryApplicants.filter((a) => a.id !== id && a._id !== id);
  inMemoryApplicants.length = 0;
  inMemoryApplicants.push(...filtered);
  return inMemoryApplicants.length < initialLength;
}
