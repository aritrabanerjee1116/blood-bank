import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Service-role client — used for both user creation (auto-confirmed)
// and profile insert (bypasses RLS). Never exposed to the browser.
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, ...metadata } = body;

    const adminClient = getAdminClient();

    // Step 1: Create the auth user via the Admin API with email_confirm: true
    // so the user is immediately confirmed and can log in without clicking
    // a confirmation email link.
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Step 2: Insert the profile row (service-role bypasses RLS).
    if (data.user) {
      const { error: profileError } = await adminClient.from('profiles').insert({
        id: data.user.id,
        email,
        role: metadata.role || 'donor',
        full_name: metadata.full_name || '',
        phone: metadata.phone || '',
        blood_group: metadata.blood_group || null,
        location: metadata.location || '',
        date_of_birth: metadata.date_of_birth || null,
        hospital_name: metadata.hospital_name || null,
        license_number: metadata.license_number || null,
        address: metadata.address || null,
        contact_person: metadata.contact_person || null,
        is_approved: metadata.role === 'donor',
      });

      if (profileError) {
        console.error('Profile insert error:', profileError.message);
        return NextResponse.json(
          { error: profileError.message },
          { status: 400 }
        );
      }
    }

    // Step 3: Sign the user in immediately so we can return a real session.
    // This lets AuthProvider call supabase.auth.setSession() on the client.
    const { createClient: createAnonClient } = await import('@supabase/supabase-js');
    const anonClient = createAnonClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: signInData } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    return NextResponse.json({
      user: data.user,
      session: signInData?.session ?? null,
    });
  } catch (err) {
    console.error('Register route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

