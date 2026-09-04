import { NextResponse } from 'next/server';

/**
 * Retired prototype endpoint.
 *
 * Real students join classes through /student/join, which uses the authenticated
 * join_class_by_code RPC and the modern teaching_classes/class_memberships model.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'This class-joining endpoint has been retired. Sign in and use the student class-joining page.' },
    { status: 410 },
  );
}
