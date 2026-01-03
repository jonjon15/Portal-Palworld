type AllowedOrigins = string[];

function getAllowedOrigins(): AllowedOrigins {
  const raw = process.env.CORS_ALLOWED_ORIGINS || process.env.APP_URL || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin: string, allowed: AllowedOrigins): boolean {
  if (allowed.length === 0) {
    return true;
  }
  return allowed.includes(origin);
}

export function applyCorsNode(req: any, res: any) {
  const origin = (req?.headers?.origin as string | undefined) ?? '';
  const allowed = getAllowedOrigins();

  // Permite chamadas sem Origin (curl/PowerShell)
  const allowOrigin = origin && isOriginAllowed(origin, allowed) ? origin : '*';

  // Bloqueia apenas navegadores com Origin não permitido
  if (origin && !isOriginAllowed(origin, allowed)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Origin não permitido (CORS).' }));
    return { blocked: true } as const;
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  return { blocked: false } as const;
}

export function getCorsHeadersForNext(request: Request) {
  const origin = request.headers.get('origin') || '';
  const allowed = getAllowedOrigins();

  // Permite sem Origin (fetch server-side) e reflete Origin permitido
  const allowOrigin = origin && isOriginAllowed(origin, allowed) ? origin : '*';

  if (origin && !isOriginAllowed(origin, allowed)) {
    return {
      blocked: true as const,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return {
    blocked: false as const,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': allowOrigin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
    },
  };
}
