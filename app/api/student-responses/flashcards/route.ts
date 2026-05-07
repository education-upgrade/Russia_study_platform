import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const DEMO_ASSIGNMENT_ID = '44444444-4444-4444-4444-444444444444';

type FlashcardRating = 'secure' | 'nearly' | 'revisit';

type FlashcardSaveRequest = {
  activityId: string;
  ratings: Record<string, FlashcardRating>;
  revealedCardIds: string[];
  totalCards: number;
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured.' },
      { status: 500 }
    );
  }

  const body = (await request.json()) as FlashcardSaveRequest;

  if (!body.activityId) {
    return NextResponse.json({ error: 'Missing activityId.' }, { status: 400 });
  }

  if (!body.totalCards || body.totalCards < 1) {
    return NextResponse.json({ error: 'Missing flashcard count.' }, { status: 400 });
  }

  const ratings = body.ratings ?? {};
  const ratingValues = Object.values(ratings);
  const secureCount = ratingValues.filter((rating) => rating === 'secure').length;
  const nearlyCount = ratingValues.filter((rating) => rating === 'nearly').length;
  const revisitCount = ratingValues.filter((rating) => rating === 'revisit').length;
  const ratedCount = ratingValues.length;
  const completionPercentage = Math.round((ratedCount / body.totalCards) * 100);
  const securePercentage = Math.round((secureCount / body.totalCards) * 100);
  const revisitCardIds = Object.entries(ratings)
    .filter(([, rating]) => rating === 'revisit')
    .map(([cardId]) => cardId);

  const responsePayload = {
    ratings,
    revealedCardIds: body.revealedCardIds ?? [],
    totalCards: body.totalCards,
    ratedCount,
    secureCount,
    nearlyCount,
    revisitCount,
    revisitCardIds,
    completionPercentage,
    securePercentage,
  };

  const status = ratedCount >= body.totalCards ? 'complete' : 'in_progress';
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from('student_responses')
    .select('id')
    .eq('student_id', DEMO_STUDENT_ID)
    .eq('assignment_id', DEMO_ASSIGNMENT_ID)
    .eq('activity_id', body.activityId)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from('student_responses')
      .update({
        response_type: 'flashcards',
        response_json: responsePayload,
        score: secureCount,
        status,
        last_saved_at: now,
        submitted_at: now,
      })
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'updated', savedAt: now, ...responsePayload });
  }

  const { error } = await supabase
    .from('student_responses')
    .insert({
      student_id: DEMO_STUDENT_ID,
      assignment_id: DEMO_ASSIGNMENT_ID,
      activity_id: body.activityId,
      response_type: 'flashcards',
      response_json: responsePayload,
      score: secureCount,
      status,
      started_at: now,
      last_saved_at: now,
      submitted_at: now,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'created', savedAt: now, ...responsePayload });
}
