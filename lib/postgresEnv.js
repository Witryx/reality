import fsSync from 'fs';
import path from 'path';

const loadEnvFallback = () => {
  const candidates = ['.env.local', '.env'];
  for (const file of candidates) {
    const full = path.join(process.cwd(), file);
    if (!fsSync.existsSync(full)) continue;

    const content = fsSync.readFileSync(full, 'utf-8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const [key, ...rest] = trimmed.split('=');
      const value = rest.join('=').trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value.replace(/^['"]|['"]$/g, '');
      }
    });
  }
};

const firstEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
};

const buildConnectionString = ({ host, user, password, database, port }) => {
  if (!host || !user || !password || !database) return null;

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  const encodedDatabase = encodeURIComponent(database);
  return `postgresql://${encodedUser}:${encodedPassword}@${host}:${port || '5432'}/${encodedDatabase}?sslmode=require`;
};

export const normalizePostgresEnv = () => {
  loadEnvFallback();

  if (!process.env.POSTGRES_URL && process.env.DATABASE_URL) {
    process.env.POSTGRES_URL = process.env.DATABASE_URL;
  }
  if (!process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL_UNPOOLED) {
    process.env.POSTGRES_URL_NON_POOLING = process.env.DATABASE_URL_UNPOOLED;
  }

  if (!process.env.POSTGRES_URL) {
    const pooledUrl = buildConnectionString({
      host: firstEnv('PGHOST', 'POSTGRES_HOST'),
      user: firstEnv('PGUSER', 'POSTGRES_USER'),
      password: firstEnv('PGPASSWORD', 'POSTGRES_PASSWORD'),
      database: firstEnv('PGDATABASE', 'POSTGRES_DATABASE'),
      port: firstEnv('PGPORT', 'POSTGRES_PORT'),
    });

    if (pooledUrl) {
      process.env.POSTGRES_URL = pooledUrl;
    }
  }

  if (!process.env.POSTGRES_URL_NON_POOLING) {
    const unpooledUrl = buildConnectionString({
      host: firstEnv('PGHOST_UNPOOLED'),
      user: firstEnv('PGUSER', 'POSTGRES_USER'),
      password: firstEnv('PGPASSWORD', 'POSTGRES_PASSWORD'),
      database: firstEnv('PGDATABASE', 'POSTGRES_DATABASE'),
      port: firstEnv('PGPORT', 'POSTGRES_PORT'),
    });

    if (unpooledUrl) {
      process.env.POSTGRES_URL_NON_POOLING = unpooledUrl;
    }
  }
};

export const hasPostgresCredentials = () => {
  normalizePostgresEnv();
  return Boolean(
    firstEnv('POSTGRES_URL', 'POSTGRES_URL_NON_POOLING', 'POSTGRES_PRISMA_URL')
  );
};

export const isVercelRuntime = () => Boolean(process.env.VERCEL);
