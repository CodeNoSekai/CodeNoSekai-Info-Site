import mongoose from 'mongoose';
import dns from 'dns';
import { ALL_COMMUNITY_MEMBERS, Member } from '@/data/members';
import { FALLBACK_REPOSITORIES, RepositoryData } from '@/data/community';
import { normalizeStatus, ApplicantStatus } from './utils';

// Fix for MongoDB Atlas SRV query resolution on local ISP DNS
try {
  dns.setServers([
    '8.8.8.8',
    '8.8.4.4',
    '1.1.1.1',
    '1.0.0.1',
  ]);
} catch (err) {
  // Ignore in environments where setting DNS is restricted
}

export type { ApplicantStatus };
export { normalizeStatus };

export type MemberRole = 'founder' | 'admin' | 'member';

/* =========================================================================
   1. APPLICANT INTERFACES & SCHEMAS
   ========================================================================= */
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
  status: ApplicantStatus | 'submitted' | string;
  whatsapp_invited?: boolean;
  invited_at?: string;
  created_at: string;
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
      default: 'pending',
    },
    whatsapp_invited: { type: Boolean, default: false },
    invited_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    strict: false,
  }
);

if (mongoose.models.Applicant) {
  try {
    delete (mongoose.models as any).Applicant;
  } catch {}
}
const ApplicantModel = mongoose.model('Applicant', applicantSchema);

export function toPlainApplicant(doc: any): ApplicantRecord {
  if (!doc) return doc;
  const rawId = doc._id ? doc._id.toString() : (doc.id ? String(doc.id) : '');
  const createdAtStr = doc.created_at
    ? (doc.created_at instanceof Date
        ? doc.created_at.toISOString()
        : String(doc.created_at))
    : new Date().toISOString();

  const invitedAtStr = doc.invited_at
    ? (doc.invited_at instanceof Date
        ? doc.invited_at.toISOString()
        : String(doc.invited_at))
    : undefined;

  return {
    id: rawId,
    _id: rawId,
    name: String(doc.name || ''),
    email: String(doc.email || ''),
    whatsapp: String(doc.whatsapp || ''),
    github: String(doc.github || ''),
    expertise: String(doc.expertise || ''),
    experience: Number(doc.experience) || 0,
    message: String(doc.message || ''),
    status: normalizeStatus(doc.status),
    whatsapp_invited: Boolean(doc.whatsapp_invited),
    invited_at: invitedAtStr,
    created_at: createdAtStr,
  };
}

/* =========================================================================
   2. COMMUNITY MEMBER INTERFACES & SCHEMAS
   ========================================================================= */
export interface CommunityMemberRecord {
  id: string;
  _id?: string;
  name: string;
  username?: string;
  role: MemberRole;
  title?: string;
  visibility: 'public' | 'private';
  bio?: string;
  avatar_url?: string;
  github?: string;
  created_at: string;
  updated_at: string;
}

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, trim: true, default: '' },
    role: {
      type: String,
      enum: ['founder', 'admin', 'member'],
      default: 'member',
    },
    title: { type: String, trim: true, default: '' },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    bio: { type: String, trim: true, default: '' },
    avatar_url: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: false,
  }
);

if (mongoose.models.CommunityMember) {
  try {
    delete (mongoose.models as any).CommunityMember;
  } catch {}
}
const MemberModel = mongoose.model('CommunityMember', memberSchema);

export function toPlainMember(doc: any): CommunityMemberRecord {
  if (!doc) return doc;
  const rawId = doc._id ? doc._id.toString() : (doc.id ? String(doc.id) : '');
  const username = doc.username ? String(doc.username).trim() : '';

  return {
    id: rawId,
    _id: rawId,
    name: String(doc.name || 'Member'),
    username,
    role: (['founder', 'admin', 'member'].includes(doc.role)
      ? doc.role
      : doc.role === 'moderator'
      ? 'admin'
      : 'member') as MemberRole,
    title: doc.title ? String(doc.title) : '',
    visibility: doc.visibility === 'private' ? 'private' : 'public',
    bio: doc.bio ? String(doc.bio) : '',
    avatar_url: doc.avatar_url
      ? String(doc.avatar_url)
      : username
      ? `https://github.com/${username}.png`
      : '',
    github: doc.github || username,
    created_at: doc.created_at
      ? (doc.created_at instanceof Date
          ? doc.created_at.toISOString()
          : String(doc.created_at))
      : new Date().toISOString(),
    updated_at: doc.updated_at
      ? (doc.updated_at instanceof Date
          ? doc.updated_at.toISOString()
          : String(doc.updated_at))
      : new Date().toISOString(),
  };
}

/* =========================================================================
   3. COMMUNITY PROJECT INTERFACES & SCHEMAS
   ========================================================================= */
export interface ProjectRecord {
  id: string;
  _id?: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  isArchived: boolean;
  isCustom: boolean;
  updatedAt: string;
  created_at: string;
}

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    url: { type: String, required: true, trim: true },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    language: { type: String, default: 'TypeScript' },
    isArchived: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: true },
    updatedAt: { type: String, default: () => new Date().toISOString() },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

const ProjectModel =
  mongoose.models.CommunityProject || mongoose.model('CommunityProject', projectSchema);

export function toPlainProject(doc: any): ProjectRecord {
  if (!doc) return doc;
  const rawId = doc._id ? doc._id.toString() : (doc.id ? String(doc.id) : '');

  return {
    id: rawId,
    _id: rawId,
    name: String(doc.name || 'Project'),
    description: String(doc.description || ''),
    url: String(doc.url || ''),
    stars: Number(doc.stars) || 0,
    forks: Number(doc.forks) || 0,
    language: String(doc.language || 'Code'),
    isArchived: Boolean(doc.isArchived),
    isCustom: Boolean(doc.isCustom ?? true),
    updatedAt: String(doc.updatedAt || new Date().toISOString()),
    created_at: doc.created_at
      ? (doc.created_at instanceof Date
          ? doc.created_at.toISOString()
          : String(doc.created_at))
      : new Date().toISOString(),
  };
}

/* =========================================================================
   4. IN-MEMORY FALLBACK STORES (For local/offline resilience)
   ========================================================================= */
const globalForDb = globalThis as unknown as {
  inMemoryApplicants?: ApplicantRecord[];
  inMemoryMembers?: CommunityMemberRecord[];
  inMemoryProjects?: ProjectRecord[];
};

// Seed applicants fallback
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
      status: 'pending',
      whatsapp_invited: false,
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
      status: 'pending',
      whatsapp_invited: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'app-seed-3',
      name: 'Takeshi Kovacs',
      email: 'takeshi@cyber.io',
      whatsapp: '+14155552671',
      github: 'kovacs-cyber',
      expertise: 'security',
      experience: 6,
      message: 'Specializing in smart contract security, rust microservices, and pentesting.',
      status: 'approved',
      whatsapp_invited: true,
      invited_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'app-seed-4',
      name: 'Jordan Miller',
      email: 'jordan.test@spam.org',
      whatsapp: '',
      github: '',
      expertise: 'frontend',
      experience: 0,
      message: 'Testing spam filters and submission speed.',
      status: 'declined',
      whatsapp_invited: false,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ];
}

// Seed members fallback with static members from data/members.ts
if (!globalForDb.inMemoryMembers) {
  globalForDb.inMemoryMembers = ALL_COMMUNITY_MEMBERS.map((m, idx) => ({
    id: `mem-${idx + 1}-${(m.username || m.name).toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    name: m.name,
    username: m.username || '',
    role: (m.role || 'member') as MemberRole,
    title: m.title || (m.role === 'founder' ? 'Founder' : m.role === 'admin' ? 'Administrator' : 'Developer'),
    visibility: m.visibility || 'public',
    bio: m.bio || '',
    avatar_url: m.username ? `https://github.com/${m.username}.png` : '',
    github: m.username || '',
    created_at: new Date(Date.now() - 86400000 * (100 - idx)).toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

// Seed projects fallback with fallback repositories from data/community.ts
if (!globalForDb.inMemoryProjects) {
  globalForDb.inMemoryProjects = FALLBACK_REPOSITORIES.map((r, idx) => ({
    id: `proj-${idx + 1}-${r.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    name: r.name,
    description: r.description,
    url: r.url,
    stars: r.stars,
    forks: r.forks,
    language: r.language || 'TypeScript',
    isArchived: r.isArchived,
    isCustom: true,
    updatedAt: r.updatedAt,
    created_at: new Date(Date.now() - 86400000 * (50 - idx)).toISOString(),
  }));
}

const inMemoryApplicants = globalForDb.inMemoryApplicants;
const inMemoryMembers = globalForDb.inMemoryMembers;
const inMemoryProjects = globalForDb.inMemoryProjects;

let isConnected = false;

/* =========================================================================
   5. DATABASE CONNECTION
   ========================================================================= */
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
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
  } catch (e) {}

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    return true;
  } catch (err: any) {
    const directUri = process.env.MONGODB_DIRECT_URI;
    if (directUri) {
      try {
        await mongoose.connect(directUri, {
          serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        return true;
      } catch {
        // Fall through to memory fallback
      }
    }

    console.warn(`[MongoDB] Connection failed: ${err.message}. Using in-memory fallback.`);
    isConnected = false;
    return false;
  }
}

/* =========================================================================
   6. APPLICANTS DATABASE OPERATIONS
   ========================================================================= */
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
        status: 'pending',
        whatsapp_invited: false,
      });
      const saved = await record.save();
      return toPlainApplicant(saved);
    } catch (e) {
      console.warn('[MongoDB] Save applicant failed, fallback to memory', e);
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
    status: 'pending',
    whatsapp_invited: false,
    created_at: new Date().toISOString(),
  };

  inMemoryApplicants.unshift(newApplicant);
  return toPlainApplicant(newApplicant);
}

export async function getAllApplicants(status?: string): Promise<ApplicantRecord[]> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      let query: any = {};
      if (status && status !== 'all') {
        const norm = normalizeStatus(status);
        if (norm === 'pending') {
          query = {
            $or: [
              { status: 'pending' },
              { status: 'submitted' },
              { status: { $exists: false } },
              { status: null },
            ],
          };
        } else if (norm === 'approved') {
          query = { status: 'approved' };
        } else if (norm === 'declined') {
          query = { $or: [{ status: 'declined' }, { status: 'rejected' }] };
        }
      }

      const docs = await ApplicantModel.find(query).sort({ created_at: -1 }).lean();
      return docs.map(toPlainApplicant);
    } catch (e) {
      console.warn('[MongoDB] Query applicants failed, fallback to memory', e);
    }
  }

  let results = [...inMemoryApplicants];
  if (status && status !== 'all') {
    const norm = normalizeStatus(status);
    results = results.filter((a) => normalizeStatus(a.status) === norm);
  }

  return results
    .map(toPlainApplicant)
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export async function getApplicantById(id: string): Promise<ApplicantRecord | null> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await ApplicantModel.findById(id).lean();
        if (doc) return toPlainApplicant(doc);
      }
      const doc = await ApplicantModel.findOne({
        $or: [{ _id: id }, { id: id }],
      }).lean();
      if (doc) return toPlainApplicant(doc);
    } catch (e) {
      // fallback
    }
  }

  const applicant = inMemoryApplicants.find((a) => a.id === id || a._id === id);
  return applicant ? toPlainApplicant(applicant) : null;
}

export async function updateApplicantStatus(
  id: string,
  status: 'pending' | 'approved' | 'declined' | string
): Promise<ApplicantRecord | null> {
  const normalized = normalizeStatus(status);
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      let doc = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        doc = await ApplicantModel.findByIdAndUpdate(
          id,
          { status: normalized },
          { new: true }
        ).lean();
      }
      if (!doc) {
        doc = await ApplicantModel.findOneAndUpdate(
          { $or: [{ _id: id }, { id: id }] },
          { status: normalized },
          { new: true }
        ).lean();
      }
      if (doc) {
        const ret = toPlainApplicant(doc);
        const memIdx = inMemoryApplicants.findIndex(
          (a) => a.id === id || a._id === id
        );
        if (memIdx !== -1) {
          inMemoryApplicants[memIdx].status = normalized;
        }
        return ret;
      }
    } catch (e) {
      console.warn('[MongoDB] Update status failed, trying memory fallback', e);
    }
  }

  const applicant = inMemoryApplicants.find((a) => a.id === id || a._id === id);
  if (applicant) {
    applicant.status = normalized;
    return toPlainApplicant(applicant);
  }
  return null;
}

export async function markApplicantWhatsAppInvited(
  id: string
): Promise<ApplicantRecord | null> {
  const dbReady = await connectToDatabase();
  const now = new Date();
  const isoNow = now.toISOString();

  if (dbReady) {
    try {
      let doc = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        doc = await ApplicantModel.findByIdAndUpdate(
          id,
          { $set: { whatsapp_invited: true, invited_at: now } },
          { new: true, strict: false }
        ).lean();
      }
      if (!doc) {
        doc = await ApplicantModel.findOneAndUpdate(
          { $or: [{ _id: id }, { id: id }] },
          { $set: { whatsapp_invited: true, invited_at: now } },
          { new: true, strict: false }
        ).lean();
      }
      if (doc) {
        const ret = toPlainApplicant(doc);
        const memIdx = inMemoryApplicants.findIndex(
          (a) => a.id === id || a._id === id
        );
        if (memIdx !== -1) {
          inMemoryApplicants[memIdx].whatsapp_invited = true;
          inMemoryApplicants[memIdx].invited_at = isoNow;
        }
        return ret;
      }
    } catch (e) {
      console.warn('[MongoDB] Mark WhatsApp invite failed, trying memory fallback', e);
    }
  }

  const applicant = inMemoryApplicants.find((a) => a.id === id || a._id === id);
  if (applicant) {
    applicant.whatsapp_invited = true;
    applicant.invited_at = isoNow;
    return toPlainApplicant(applicant);
  }
  return null;
}

export async function deleteApplicant(id: string): Promise<boolean> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await ApplicantModel.findByIdAndDelete(id);
        if (deleted) {
          const memIdx = inMemoryApplicants.findIndex((a) => a.id === id || a._id === id);
          if (memIdx !== -1) inMemoryApplicants.splice(memIdx, 1);
          return true;
        }
      }
      const res = await ApplicantModel.deleteOne({ $or: [{ _id: id }, { id: id }] });
      if (res.deletedCount > 0) {
        const memIdx = inMemoryApplicants.findIndex((a) => a.id === id || a._id === id);
        if (memIdx !== -1) inMemoryApplicants.splice(memIdx, 1);
        return true;
      }
    } catch (e) {
      console.warn('[MongoDB] Delete applicant failed, trying memory fallback', e);
    }
  }

  const initialLength = inMemoryApplicants.length;
  const filtered = inMemoryApplicants.filter((a) => a.id !== id && a._id !== id);
  inMemoryApplicants.length = 0;
  inMemoryApplicants.push(...filtered);
  return inMemoryApplicants.length < initialLength;
}

/* =========================================================================
   7. COMMUNITY MEMBERS DATABASE OPERATIONS
   ========================================================================= */
export async function getAllMembers(): Promise<CommunityMemberRecord[]> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      const count = await MemberModel.countDocuments();
      // If DB has no members yet, seed from static definitions
      if (count === 0 && ALL_COMMUNITY_MEMBERS.length > 0) {
        await MemberModel.insertMany(
          ALL_COMMUNITY_MEMBERS.map((m) => ({
            name: m.name,
            username: m.username || '',
            role: m.role || 'member',
            title: m.title || '',
            visibility: m.visibility || 'public',
            bio: m.bio || '',
            avatar_url: m.username ? `https://github.com/${m.username}.png` : '',
            github: m.username || '',
          }))
        );
      }

      const docs = await MemberModel.find({})
        .sort({ role: 1, name: 1 })
        .lean();
      if (docs && docs.length > 0) {
        return docs.map(toPlainMember);
      }
    } catch (e) {
      console.warn('[MongoDB] Query members failed, fallback to memory', e);
    }
  }

  return [...inMemoryMembers].map(toPlainMember);
}

export async function getMemberByUsername(
  rawUsername: string
): Promise<CommunityMemberRecord | null> {
  if (!rawUsername) return null;
  const clean = rawUsername
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/\/.*$/, '')
    .replace(/^@/, '')
    .trim()
    .toLowerCase();
  if (!clean) return null;

  const dbReady = await connectToDatabase();
  if (dbReady) {
    try {
      const doc = await MemberModel.findOne({
        $or: [
          { username: { $regex: new RegExp(`^${clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
          { github: { $regex: new RegExp(`^${clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        ],
      }).lean();
      if (doc) return toPlainMember(doc);
    } catch (e) {
      console.warn('[MongoDB] Query member by username failed, checking memory fallback', e);
    }
  }

  const found = inMemoryMembers.find((m) => {
    const u = (m.username || '').trim().replace(/^@/, '').toLowerCase();
    const g = (m.github || '')
      .trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
      .replace(/\/.*$/, '')
      .replace(/^@/, '')
      .toLowerCase();
    return u === clean || g === clean;
  });

  return found ? toPlainMember(found) : null;
}

export async function addMember(data: {
  name: string;
  username?: string;
  role?: MemberRole;
  title?: string;
  visibility?: 'public' | 'private';
  bio?: string;
  github?: string;
}): Promise<CommunityMemberRecord> {
  const username = data.username ? data.username.trim().replace(/^@/, '') : '';
  const role: MemberRole = data.role && ['founder', 'admin', 'member'].includes(data.role)
    ? data.role
    : (data.role as any) === 'moderator'
    ? 'admin'
    : 'member';

  if (username) {
    const existing = await getMemberByUsername(username);
    if (existing) {
      throw new Error(`Profile with username @${username} already exists on the website.`);
    }
  }

  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      const record = new MemberModel({
        name: data.name.trim(),
        username,
        role,
        title: data.title?.trim() || '',
        visibility: data.visibility === 'private' ? 'private' : 'public',
        bio: data.bio?.trim() || '',
        avatar_url: username ? `https://github.com/${username}.png` : '',
        github: data.github?.trim() || username,
      });
      const saved = await record.save();
      return toPlainMember(saved);
    } catch (e) {
      console.warn('[MongoDB] Add member failed, fallback to memory', e);
    }
  }

  const newMember: CommunityMemberRecord = {
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    username,
    role,
    title: data.title?.trim() || '',
    visibility: data.visibility === 'private' ? 'private' : 'public',
    bio: data.bio?.trim() || '',
    avatar_url: username ? `https://github.com/${username}.png` : '',
    github: data.github?.trim() || username,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  inMemoryMembers.unshift(newMember);
  return toPlainMember(newMember);
}

export async function updateMember(
  id: string,
  updates: Partial<CommunityMemberRecord>
): Promise<CommunityMemberRecord | null> {
  const dbReady = await connectToDatabase();

  const updateFields: any = {};
  if (updates.name !== undefined) updateFields.name = updates.name.trim();
  if (updates.username !== undefined) {
    const un = updates.username.trim().replace(/^@/, '');
    updateFields.username = un;
    updateFields.github = un;
    if (un) updateFields.avatar_url = `https://github.com/${un}.png`;
  }
  if (updates.role !== undefined) updateFields.role = updates.role;
  if (updates.title !== undefined) updateFields.title = updates.title.trim();
  if (updates.visibility !== undefined) updateFields.visibility = updates.visibility;
  if (updates.bio !== undefined) updateFields.bio = updates.bio.trim();
  updateFields.updated_at = new Date();

  if (dbReady) {
    try {
      let doc = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        doc = await MemberModel.findByIdAndUpdate(id, updateFields, { new: true }).lean();
      }
      if (!doc) {
        doc = await MemberModel.findOneAndUpdate(
          { $or: [{ _id: id }, { id: id }, { username: id }] },
          updateFields,
          { new: true }
        ).lean();
      }
      if (doc) {
        const plain = toPlainMember(doc);
        const memIdx = inMemoryMembers.findIndex((m) => m.id === id || m._id === id || m.username === id);
        if (memIdx !== -1) {
          inMemoryMembers[memIdx] = { ...inMemoryMembers[memIdx], ...plain };
        }
        return plain;
      }
    } catch (e) {
      console.warn('[MongoDB] Update member failed, trying memory fallback', e);
    }
  }

  const memIdx = inMemoryMembers.findIndex((m) => m.id === id || m._id === id || m.username === id);
  if (memIdx !== -1) {
    inMemoryMembers[memIdx] = {
      ...inMemoryMembers[memIdx],
      ...updateFields,
      updated_at: new Date().toISOString(),
    };
    return toPlainMember(inMemoryMembers[memIdx]);
  }

  return null;
}

export async function assignMemberRole(
  id: string,
  role: MemberRole
): Promise<CommunityMemberRecord | null> {
  return updateMember(id, { role });
}

export async function deleteMember(id: string): Promise<boolean> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await MemberModel.findByIdAndDelete(id);
        if (deleted) {
          const memIdx = inMemoryMembers.findIndex((m) => m.id === id || m._id === id || m.username === id);
          if (memIdx !== -1) inMemoryMembers.splice(memIdx, 1);
          return true;
        }
      }
      const res = await MemberModel.deleteOne({
        $or: [{ _id: id }, { id: id }, { username: id }],
      });
      if (res.deletedCount > 0) {
        const memIdx = inMemoryMembers.findIndex((m) => m.id === id || m._id === id || m.username === id);
        if (memIdx !== -1) inMemoryMembers.splice(memIdx, 1);
        return true;
      }
    } catch (e) {
      console.warn('[MongoDB] Delete member failed, trying memory fallback', e);
    }
  }

  const initialLength = inMemoryMembers.length;
  const filtered = inMemoryMembers.filter((m) => m.id !== id && m._id !== id && m.username !== id);
  inMemoryMembers.length = 0;
  inMemoryMembers.push(...filtered);
  return inMemoryMembers.length < initialLength;
}

/* =========================================================================
   8. COMMUNITY PROJECTS DATABASE OPERATIONS
   ========================================================================= */
export async function getAllProjects(): Promise<ProjectRecord[]> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      const count = await ProjectModel.countDocuments();
      if (count === 0 && FALLBACK_REPOSITORIES.length > 0) {
        await ProjectModel.insertMany(
          FALLBACK_REPOSITORIES.map((r) => ({
            name: r.name,
            description: r.description,
            url: r.url,
            stars: r.stars,
            forks: r.forks,
            language: r.language || 'TypeScript',
            isArchived: r.isArchived,
            isCustom: true,
            updatedAt: r.updatedAt,
          }))
        );
      }

      const docs = await ProjectModel.find({}).sort({ stars: -1, created_at: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map(toPlainProject);
      }
    } catch (e) {
      console.warn('[MongoDB] Query projects failed, fallback to memory', e);
    }
  }

  return [...inMemoryProjects].map(toPlainProject);
}

export async function addProject(data: {
  name: string;
  description?: string;
  url: string;
  stars?: number;
  forks?: number;
  language?: string;
  isArchived?: boolean;
}): Promise<ProjectRecord> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      const record = new ProjectModel({
        name: data.name.trim(),
        description: data.description?.trim() || 'Open source community project.',
        url: data.url.trim(),
        stars: Number(data.stars) || 0,
        forks: Number(data.forks) || 0,
        language: data.language?.trim() || 'TypeScript',
        isArchived: Boolean(data.isArchived),
        isCustom: true,
        updatedAt: new Date().toISOString(),
      });
      const saved = await record.save();
      return toPlainProject(saved);
    } catch (e) {
      console.warn('[MongoDB] Add project failed, fallback to memory', e);
    }
  }

  const newProject: ProjectRecord = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    description: data.description?.trim() || 'Open source community project.',
    url: data.url.trim(),
    stars: Number(data.stars) || 0,
    forks: Number(data.forks) || 0,
    language: data.language?.trim() || 'TypeScript',
    isArchived: Boolean(data.isArchived),
    isCustom: true,
    updatedAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  inMemoryProjects.unshift(newProject);
  return toPlainProject(newProject);
}

export async function updateProject(
  id: string,
  updates: Partial<ProjectRecord>
): Promise<ProjectRecord | null> {
  const dbReady = await connectToDatabase();

  const updateFields: any = {};
  if (updates.name !== undefined) updateFields.name = updates.name.trim();
  if (updates.description !== undefined) updateFields.description = updates.description.trim();
  if (updates.url !== undefined) updateFields.url = updates.url.trim();
  if (updates.stars !== undefined) updateFields.stars = Number(updates.stars) || 0;
  if (updates.forks !== undefined) updateFields.forks = Number(updates.forks) || 0;
  if (updates.language !== undefined) updateFields.language = updates.language.trim();
  if (updates.isArchived !== undefined) updateFields.isArchived = Boolean(updates.isArchived);
  updateFields.updatedAt = new Date().toISOString();

  if (dbReady) {
    try {
      let doc = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        doc = await ProjectModel.findByIdAndUpdate(id, updateFields, { new: true }).lean();
      }
      if (!doc) {
        doc = await ProjectModel.findOneAndUpdate(
          { $or: [{ _id: id }, { id: id }, { name: id }] },
          updateFields,
          { new: true }
        ).lean();
      }
      if (doc) {
        const plain = toPlainProject(doc);
        const pIdx = inMemoryProjects.findIndex((p) => p.id === id || p._id === id || p.name === id);
        if (pIdx !== -1) {
          inMemoryProjects[pIdx] = { ...inMemoryProjects[pIdx], ...plain };
        }
        return plain;
      }
    } catch (e) {
      console.warn('[MongoDB] Update project failed, trying memory fallback', e);
    }
  }

  const pIdx = inMemoryProjects.findIndex((p) => p.id === id || p._id === id || p.name === id);
  if (pIdx !== -1) {
    inMemoryProjects[pIdx] = {
      ...inMemoryProjects[pIdx],
      ...updateFields,
    };
    return toPlainProject(inMemoryProjects[pIdx]);
  }

  return null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const dbReady = await connectToDatabase();

  if (dbReady) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await ProjectModel.findByIdAndDelete(id);
        if (deleted) {
          const pIdx = inMemoryProjects.findIndex((p) => p.id === id || p._id === id || p.name === id);
          if (pIdx !== -1) inMemoryProjects.splice(pIdx, 1);
          return true;
        }
      }
      const res = await ProjectModel.deleteOne({
        $or: [{ _id: id }, { id: id }, { name: id }],
      });
      if (res.deletedCount > 0) {
        const pIdx = inMemoryProjects.findIndex((p) => p.id === id || p._id === id || p.name === id);
        if (pIdx !== -1) inMemoryProjects.splice(pIdx, 1);
        return true;
      }
    } catch (e) {
      console.warn('[MongoDB] Delete project failed, trying memory fallback', e);
    }
  }

  const initialLength = inMemoryProjects.length;
  const filtered = inMemoryProjects.filter((p) => p.id !== id && p._id !== id && p.name !== id);
  inMemoryProjects.length = 0;
  inMemoryProjects.push(...filtered);
  return inMemoryProjects.length < initialLength;
}
