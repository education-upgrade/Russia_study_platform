import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

type JoinClassRequest = {
  classCode?: string;
  studentId?: string;
};

type ClassLookup = {
  id: string;
  class_name: string;
  class_code: string;
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }

  const body = (await request.json()) as JoinClassRequest;
  const classCode = body.classCode?.trim().toUpperCase();
  const studentId = body.studentId || DEMO_STUDENT_ID;

  if (!classCode) {
    return NextResponse.json({ error: 'Enter a class code.' }, { status: 400 });
  }

  const { data: foundClass, error: classError } = await supabase
    .from('classes')
    .select('id, class_name, class_code')
    .eq('class_code', classCode)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle<ClassLookup>();

  if (classError || !foundClass) {
    return NextResponse.json({ error: 'Class code not recognised.' }, { status: 404 });
  }

  const membershipPayload = {
    class_id: foundClass.id,
    student_id: studentId,
    status: 'active',
  };

  const { error: membershipError } = await supabase
    .from('class_memberships')
    .upsert(membershipPayload, {
      onConflict: 'class_id,student_id',
      ignoreDuplicates: false,
    });

  if (membershipError) {
    return NextResponse.json({
      error: membershipError.message,
      setupHint: 'Run supabase/auth-class-membership.sql in the Supabase SQL editor.',
    }, { status: 500 });
  }

  return NextResponse.json({
    status: 'joined',
    classId: foundClass.id,
    className: foundClass.class_name,
    classCode: foundClass.class_code,
  });
}
