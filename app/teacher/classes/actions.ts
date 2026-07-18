'use server';

import { redirect } from 'next/navigation';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function createClassAction(formData: FormData) {
  await requireRoles(['teacher', 'admin']);
  const schoolName = String(formData.get('schoolName') || '').trim();
  const className = String(formData.get('className') || '').trim();
  const academicYear = String(formData.get('academicYear') || '').trim();

  if (schoolName.length < 2 || className.length < 2) {
    redirect('/teacher/classes?error=missing');
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect('/teacher/classes?error=configuration');

  const { data, error } = await supabase.rpc('create_classroom', {
    school_name_input: schoolName,
    class_name_input: className,
    academic_year_input: academicYear || null,
  });

  if (error || !data) {
    console.error('Unable to create class', error?.message);
    redirect('/teacher/classes?error=create');
  }

  redirect(`/teacher/classes?created=${data}`);
}
