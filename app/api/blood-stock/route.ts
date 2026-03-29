import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET: Fetch all blood stock
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('blood_group');
    const status = searchParams.get('status') || 'available';

    let query = supabase.from('blood_stock').select('*').eq('status', status);

    if (bloodGroup) {
      query = query.eq('blood_group', bloodGroup);
    }

    const { data, error } = await query.order('blood_group');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Add new blood stock
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase.from('blood_stock').insert(body).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Update blood stock
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase.from('blood_stock').update(updates).eq('id', id).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove blood stock
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('blood_stock').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
