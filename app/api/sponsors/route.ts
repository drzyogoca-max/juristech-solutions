import { NextResponse } from 'next/server';

export async function GET() {
  // Purged mock sponsors count (Returns 0 active sponsors)
  return NextResponse.json({
    activeSponsors: 0,
    sponsors: [],
    status: 'ZERO_MOCK_PURGED',
  });
}
