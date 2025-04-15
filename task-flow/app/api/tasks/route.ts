// app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET all tasks for authenticated user
export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabaseClient = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Verify authentication
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get query parameters
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter');
    
    // Base query
    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true });
    
    // Apply filters if needed
    if (filter === "today") {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq("due_date", today);
    } else if (filter === "upcoming") {
      const today = new Date().toISOString().split('T')[0];
      query = query.gt("due_date", today);
    } else if (filter === "completed") {
      query = query.eq("completed", true);
    } else if (filter === "priority") {
      query = query.eq("priority", "high");
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ tasks: data });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new task
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabaseClient = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Verify authentication
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get task data from request
    const taskData = await req.json();
    
    // Insert task with user_id
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        ...taskData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ task: data });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH to update a task
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabaseClient = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Verify authentication
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get task data and id from request
    const { id, ...taskData } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    
    // Update task
    const { data, error } = await supabase
      .from("tasks")
      .update({
        ...taskData,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("user_id", userId) // Security check
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ task: data });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a task
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabaseClient = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Verify authentication
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get task id from URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    
    // Delete task
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // Security check
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
