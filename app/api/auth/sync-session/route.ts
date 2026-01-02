import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Cette route permet de synchroniser la session côté serveur
// après une connexion côté client (signInWithPassword)
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ success: false, error: 'No session' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Sync session error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
