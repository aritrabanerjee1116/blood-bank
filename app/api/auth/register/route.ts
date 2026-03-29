import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, ...metadata } = body;

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create profile entry
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        role: metadata.role || 'donor',
        full_name: metadata.full_name || '',
        phone: metadata.phone || '',
        blood_group: metadata.blood_group || null,
        location: metadata.location || '',
        hospital_name: metadata.hospital_name || null,
        license_number: metadata.license_number || null,
        address: metadata.address || null,
        contact_person: metadata.contact_person || null,
        is_approved: metadata.role === 'donor',
      });

      if (profileError) {
        return NextResponse.json(
          { error: profileError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
