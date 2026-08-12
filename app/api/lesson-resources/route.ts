import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { pathwayRegistry } from '@/lib/pathwayRegistry';

const allowedTypes = new Set(['slides', 'worksheet', 'exam_question', 'mark_scheme', 'model_answer', 'video', 'website', 'reading', 'other']);

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in before adding a resource.' }, { status: 401 });

  const profile = await getProfile(supabase, user.id);
  if (!profile || profile.status !== 'active' || !['teacher', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Only active teachers can add lesson resources.' }, { status: 403 });
  }

  const body = await request.json();
  const pathwaySlug = String(body.pathwaySlug ?? '').trim();
  const title = String(body.title ?? '').trim();
  const description = String(body.description ?? '').trim();
  const resourceType = String(body.resourceType ?? '').trim();
  const resourceUrl = String(body.resourceUrl ?? '').trim();
  const visibility = body.visibility === 'teacher' ? 'teacher' : 'student';

  if (!pathwayRegistry[pathwaySlug]) return NextResponse.json({ error: 'Choose a recognised lesson pathway.' }, { status: 400 });
  if (!title) return NextResponse.json({ error: 'Add a resource title.' }, { status: 400 });
  if (!allowedTypes.has(resourceType)) return NextResponse.json({ error: 'Choose a recognised resource type.' }, { status: 400 });

  try {
    const parsed = new URL(resourceUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: 'Add a valid http or https link.' }, { status: 400 });
  }

  const { data, error } = await supabase.from('lesson_resources').insert({
    pathway_slug: pathwaySlug,
    title,
    description: description || null,
    resource_type: resourceType,
    resource_url: resourceUrl,
    visibility,
    created_by: user.id,
  }).select('id').single();

  if (error || !data) return NextResponse.json({ error: error?.message ?? 'Resource could not be created.' }, { status: 500 });
  return NextResponse.json({ resourceId: data.id });
}
