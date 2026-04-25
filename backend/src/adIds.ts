import type { Pool, PoolClient } from 'pg';

const AD_ID_REGEX = /^AD(\d+)$/i;
const BUSINESS_AD_ID_LOCK_KEY = 430033;

type Queryable = Pick<Pool, 'query'>;

type HttpError = Error & {
  status: number;
  code: string;
};

function createHttpError(status: number, code: string, message: string): HttpError {
  return Object.assign(new Error(message), { status, code });
}

export function formatAdId(sequence: number): string {
  return `AD${String(sequence).padStart(3, '0')}`;
}

export function parseAdIdNumber(value: unknown): number | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim().toUpperCase();
  if (!trimmedValue) {
    return null;
  }

  const match = trimmedValue.match(AD_ID_REGEX);
  if (!match) {
    return null;
  }

  const numericValue = parseInt(match[1], 10);
  if (!Number.isFinite(numericValue) || numericValue < 1) {
    return null;
  }

  return numericValue;
}

export function normalizeAdIdInput(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim().toUpperCase();
  if (!trimmedValue) {
    return null;
  }

  const digits = trimmedValue.startsWith('AD') ? trimmedValue.slice(2) : trimmedValue;
  if (!/^\d+$/.test(digits)) {
    throw createHttpError(400, 'INVALID_AD_ID', 'Ad ID must use the format AD001 or digits only.');
  }

  const numericValue = parseInt(digits, 10);
  if (!Number.isFinite(numericValue) || numericValue < 1) {
    throw createHttpError(400, 'INVALID_AD_ID', 'Ad ID must be greater than zero.');
  }

  return formatAdId(numericValue);
}

export async function getNextSequentialAdId(db: Queryable): Promise<string> {
  const result = await db.query(
    `SELECT COALESCE(MAX(CAST(SUBSTRING(UPPER(TRIM(adid)) FROM 3) AS INTEGER)), 0) AS max_number
     FROM businesses
     WHERE UPPER(TRIM(adid)) ~ '^AD[0-9]+$'`
  );

  const maxNumber = parseInt(result.rows[0]?.max_number ?? '0', 10) || 0;
  return formatAdId(maxNumber + 1);
}

async function ensureAdIdAvailable(
  db: Queryable,
  adId: string,
  excludeBusinessId?: number
): Promise<void> {
  const params: Array<number | string> = [adId];
  let query = 'SELECT id FROM businesses WHERE LOWER(TRIM(adid)) = LOWER(TRIM($1))';

  if (typeof excludeBusinessId === 'number') {
    query += ' AND id <> $2';
    params.push(excludeBusinessId);
  }

  const duplicateCheck = await db.query(query, params);
  if ((duplicateCheck.rowCount ?? 0) > 0) {
    throw createHttpError(409, 'DUPLICATE_AD_ID', `Ad ID ${adId} already exists.`);
  }
}

export async function resolveBusinessAdIdForCreate(
  db: Queryable,
  requestedAdId: unknown
): Promise<string> {
  const normalizedAdId = normalizeAdIdInput(requestedAdId);
  if (normalizedAdId) {
    await ensureAdIdAvailable(db, normalizedAdId);
    return normalizedAdId;
  }

  return getNextSequentialAdId(db);
}

export async function resolveBusinessAdIdForUpdate(
  db: Queryable,
  businessId: number,
  requestedAdId: unknown
): Promise<string> {
  const currentBusiness = await db.query('SELECT adid FROM businesses WHERE id = $1', [businessId]);
  if ((currentBusiness.rowCount ?? 0) === 0) {
    throw createHttpError(404, 'NOT_FOUND', 'Business not found.');
  }

  const normalizedAdId = normalizeAdIdInput(requestedAdId);
  if (normalizedAdId) {
    await ensureAdIdAvailable(db, normalizedAdId, businessId);
    return normalizedAdId;
  }

  const existingAdIdNumber = parseAdIdNumber(currentBusiness.rows[0]?.adid);
  if (existingAdIdNumber !== null) {
    return formatAdId(existingAdIdNumber);
  }

  return getNextSequentialAdId(db);
}

export async function withBusinessAdIdLock<T>(
  db: Pool,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock($1)', [BUSINESS_AD_ID_LOCK_KEY]);

    const result = await callback(client);
    await client.query('COMMIT');

    return result;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export async function backfillBusinessAdIds(db: Pool): Promise<void> {
  await withBusinessAdIdLock(db, async (client) => {
    const result = await client.query(
      'SELECT id, adid FROM businesses ORDER BY created_at ASC, id ASC'
    );

    if ((result.rowCount ?? 0) === 0) {
      await client.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS businesses_adid_unique_idx
         ON businesses (LOWER(TRIM(adid)))
         WHERE adid IS NOT NULL AND LENGTH(TRIM(adid)) > 0`
      );
      return;
    }

    const usedNumbers = new Set<number>();
    const pendingAssignments: Array<{ id: number; adId: string | null }> = [];

    for (const row of result.rows) {
      const numericAdId = parseAdIdNumber(row.adid);

      if (numericAdId !== null && !usedNumbers.has(numericAdId)) {
        usedNumbers.add(numericAdId);

        const normalizedAdId = formatAdId(numericAdId);
        if ((row.adid ?? '').trim().toUpperCase() !== normalizedAdId) {
          pendingAssignments.push({ id: row.id, adId: normalizedAdId });
        }

        continue;
      }

      pendingAssignments.push({ id: row.id, adId: null });
    }

    let nextSequence = 1;

    for (const assignment of pendingAssignments) {
      if (assignment.adId) {
        await client.query('UPDATE businesses SET adid = $1 WHERE id = $2', [
          assignment.adId,
          assignment.id,
        ]);
        continue;
      }

      while (usedNumbers.has(nextSequence)) {
        nextSequence += 1;
      }

      const generatedAdId = formatAdId(nextSequence);
      usedNumbers.add(nextSequence);
      nextSequence += 1;

      await client.query('UPDATE businesses SET adid = $1 WHERE id = $2', [
        generatedAdId,
        assignment.id,
      ]);
    }

    await client.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS businesses_adid_unique_idx
       ON businesses (LOWER(TRIM(adid)))
       WHERE adid IS NOT NULL AND LENGTH(TRIM(adid)) > 0`
    );
  });
}
