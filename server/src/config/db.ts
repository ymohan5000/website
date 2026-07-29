import mongoose from 'mongoose';
import { Resolver } from 'node:dns/promises';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config/index.js';

let memoryServer: MongoMemoryServer | null = null;

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

async function connect(uri: string, label: string): Promise<void> {
  await mongoose.connect(uri, MONGO_OPTIONS);
  console.log(`MongoDB connected (${label})`);
}

async function resolveAtlasDirectUri(srvUri: string): Promise<string | null> {
  const match = srvUri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(?:\/([^?]*))?(.*)?$/);
  if (!match) return null;

  const [, credentials, host, dbname = '', query = ''] = match;
  const srvName = `_mongodb._tcp.${host}`;
  const dnsServers = [
    ['8.8.8.8', '8.8.4.4'],
    ['1.1.1.1', '1.0.0.1'],
  ];

  for (const servers of dnsServers) {
    try {
      const resolver = new Resolver();
      resolver.setServers(servers);
      const records = await resolver.resolveSrv(srvName);
      if (!records.length) continue;

      const hosts = records
        .sort((a, b) => a.priority - b.priority || a.weight - b.weight)
        .map((record) => `${record.name}:${record.port}`)
        .join(',');

      const params = new URLSearchParams(query.replace(/^\?/, ''));
      params.set('ssl', 'true');
      params.set('authSource', 'admin');

      const dbPath = dbname || 'portfolio';
      return `mongodb://${credentials}@${hosts}/${dbPath}?${params.toString()}`;
    } catch {
      // Try the next public DNS resolver.
    }
  }

  return null;
}

async function ensureDevAdmin(): Promise<void> {
  const bcrypt = await import('bcryptjs');
  const { User } = await import('../models/User.js');
  const adminEmail = process.env.ADMIN_EMAIL || 'ymohan5000@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123!';

  const existing = await User.findOne({ email: adminEmail });
  if (existing) return;

  const hashed = await bcrypt.hash(adminPassword, 12);
  await User.create({
    name: 'Mohan Yadav',
    email: adminEmail,
    password: hashed,
    role: 'admin',
  });
  console.log(`Dev admin ready: ${adminEmail}`);
}

async function connectInMemory(label: string): Promise<void> {
  memoryServer = await MongoMemoryServer.create();
  await connect(memoryServer.getUri(), label);
  await ensureDevAdmin();
  console.warn('Using in-memory MongoDB — data resets when the server stops. Run npm run seed for full data.');
}

export async function connectDB(): Promise<void> {
  const { mongodbUri, localMongodbUri, nodeEnv } = config;
  const useMemory = process.env.MONGODB_USE_MEMORY === 'true';

  if (!mongodbUri && !localMongodbUri && !useMemory) {
    console.error('No MongoDB URI configured — set MONGODB_URI or MONGODB_LOCAL_URI');
    process.exit(1);
  }

  if (useMemory && nodeEnv === 'development') {
    await connectInMemory('in-memory');
    return;
  }

  if (mongodbUri) {
    try {
      await connect(mongodbUri, 'atlas');
      return;
    } catch (err) {
      console.warn('MongoDB Atlas connection failed:', err);
    }

    if (mongodbUri.startsWith('mongodb+srv://')) {
      const directUri = await resolveAtlasDirectUri(mongodbUri);
      if (directUri) {
        try {
          await connect(directUri, 'atlas-direct');
          return;
        } catch (err) {
          console.warn('MongoDB Atlas direct connection failed:', err);
        }
      } else {
        console.warn('Could not resolve Atlas SRV record via public DNS.');
      }
    }
  }

  if (localMongodbUri) {
    console.warn('Falling back to local MongoDB...');
    try {
      await connect(localMongodbUri, 'local');
      return;
    } catch (err) {
      console.warn('Local MongoDB connection failed:', err);
    }
  }

  if (nodeEnv === 'development') {
    console.warn('Starting in-memory MongoDB for development...');
    await connectInMemory('in-memory');
    return;
  }

  console.error('All MongoDB connection attempts failed.');
  process.exit(1);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
