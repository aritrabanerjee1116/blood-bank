import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pcerfqceepjgixyxqivj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZXJmcWNlZXBqZ2l4eXhxaXZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYxNjM2NCwiZXhwIjoyMDkwMTkyMzY0fQ.oULUcyjjrtZNRGclB81veaEVqtf_42d7fMMI5jXntpA' // IMPORTANT (not anon key)
)

const bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-']

async function createUsers() {

  // 🔹 DONORS
  for (let i = 1; i <= 50; i++) {
    const email = `donor${i}@mail.com`
    const password = '12345678'

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) {
      console.log(error)
      continue
    }

    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      role: 'donor',
      full_name: `Donor ${i}`,
      phone: `90000000${i}`,
      blood_group: bloodGroups[Math.floor(Math.random()*8)],
      location: 'Kolkata'
    })
  }

  // 🔹 HOSPITALS
  for (let i = 1; i <= 10; i++) {
    const email = `hospital${i}@mail.com`
    const password = '12345678'

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) continue

    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      role: 'hospital',
      full_name: `Hospital Admin ${i}`,
      hospital_name: `Hospital ${i}`,
      license_number: `LIC${1000+i}`,
      address: `Kolkata`,
      contact_person: `Person ${i}`
    })
  }

  // 🔹 ADMIN
  const { data } = await supabase.auth.admin.createUser({
    email: 'admin@mail.com',
    password: 'admin123',
    email_confirm: true
  })

  await supabase.from('profiles').insert({
    id: data.user.id,
    email: 'admin@mail.com',
    role: 'admin',
    full_name: 'Super Admin'
  })

  console.log('✅ All users created')
}

createUsers()