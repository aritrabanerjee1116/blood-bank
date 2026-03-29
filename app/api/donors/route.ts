import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET: Search donors by blood group and/or location
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('blood_group');
    const location = searchParams.get('location');

    let query = supabase
      .from('profiles')
      .select('id, full_name, blood_group, location, phone')
      .eq('role', 'donor')
      .eq('is_approved', true);

    if (bloodGroup) {
      query = query.eq('blood_group', bloodGroup);
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query.order('full_name');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
