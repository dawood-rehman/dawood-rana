import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = null;

  try {
    const dbStart = Date.now();
    await connectToDatabase();
    const readyState = mongoose.connection.readyState;
    dbLatencyMs = Date.now() - dbStart;

    if (readyState === 1) {
      dbStatus = 'connected';
    } else if (readyState === 2) {
      dbStatus = 'connecting';
    } else {
      dbStatus = 'disconnected';
    }
  } catch (error) {
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'connected' || dbStatus === 'connecting';
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      durationMs: Date.now() - startTime,
    },
    {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
