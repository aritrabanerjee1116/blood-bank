import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET: List appointments (optionally filtered by donor_id)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const donorId = searchParams.get('donor_id');

    let query = supabase.from('appointments').select('*').order('scheduled_date', { ascending: false });

    if (donorId) {
      query = query.eq('donor_id', donorId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Schedule new appointment
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('appointments')
      .insert({ ...body, status: 'scheduled' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
