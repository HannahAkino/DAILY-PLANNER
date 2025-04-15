// app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase";
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from "@/lib/supabase";

// Helper function to extract JWT from Authorization header
function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

// Direct database access with user_id from token
async function getDirectSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET all tasks for authenticated user
export async function GET(req: NextRequest) {
  try {
    // Get token from header
    const token = extractBearerToken(req);
    if (!token) {
      console.error("No authorization token provided in request");
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
    }
    
    // Verify token and get user_id using the utility function
    const userId = await verifyToken(token);
    console.log("API GET tasks - User ID extraction:", userId ? "Found" : "Not found");
    
    if (!userId) {
      console.error("Invalid or expired token");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    
    // Get direct database access
    const supabase = await getDirectSupabaseClient();
    
    // Get query parameters
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter');
    
    // Base query - filter by user_id directly
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
      console.error("Database query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ tasks: data });
    
  } catch (error: any) {
    console.error("GET tasks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new task
export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/tasks - Processing task creation request");
    
    // Get token from header
    const token = extractBearerToken(req);
    if (!token) {
      console.error("No authorization token provided in request");
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
    }
    
    // Verify token and get user_id using the utility function
    const userId = await verifyToken(token);
    console.log("API POST task - User ID extraction:", userId ? "Found" : "Not found");
    
    if (!userId) {
      console.error("Invalid or expired token");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    
    // Get direct database access
    const supabase = await getDirectSupabaseClient();
    
    // Get task data from request
    const taskData = await req.json();
    console.log("Creating new task for user:", userId, taskData);
    
    // Ensure we're using snake_case for database fields
    const normalizedTaskData = {
      title: taskData.title,
      description: taskData.description || '',
      // Handle both camelCase and snake_case field names
      due_date: taskData.due_date || taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      reminder: taskData.reminder,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed: false
    };
    
    console.log("Normalized task data:", normalizedTaskData);
    
    // Insert task with user_id
    const { data, error } = await supabase
      .from("tasks")
      .insert(normalizedTaskData)
      .select()
      .single();
    
    if (error) {
      console.error("Task creation error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log("Task created successfully:", data);
    return NextResponse.json({ task: data });
    
  } catch (error: any) {
    console.error("POST task error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH to update a task
export async function PATCH(req: NextRequest) {
  try {
    // Get token from header
    const token = extractBearerToken(req);
    if (!token) {
      console.error("No authorization token provided in request");
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
    }
    
    // Verify token and get user_id using the utility function
    const userId = await verifyToken(token);
    console.log("API PATCH task - User ID extraction:", userId ? "Found" : "Not found");
    
    if (!userId) {
      console.error("Invalid or expired token");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    
    // Get direct database access
    const supabase = await getDirectSupabaseClient();
    
    // Get task data and id from request
    const { id, ...taskData } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    
    // Ensure we're using snake_case for database fields
    const normalizedTaskData = {
      ...(taskData.title !== undefined && { title: taskData.title }),
      ...(taskData.description !== undefined && { description: taskData.description }),
      // Handle both camelCase and snake_case field names
      ...(taskData.due_date !== undefined && { due_date: taskData.due_date }),
      ...(taskData.dueDate !== undefined && { due_date: taskData.dueDate }),
      ...(taskData.priority !== undefined && { priority: taskData.priority }),
      ...(taskData.reminder !== undefined && { reminder: taskData.reminder }),
      ...(taskData.completed !== undefined && { completed: taskData.completed }),
      updated_at: new Date().toISOString()
    };
    
    console.log("Updating task with normalized data:", id, normalizedTaskData);
    
    // Update task
    const { data, error } = await supabase
      .from("tasks")
      .update(normalizedTaskData)
      .eq("id", id)
      .eq("user_id", userId) // Security check
      .select()
      .single();
    
    if (error) {
      console.error("Task update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ task: data });
    
  } catch (error: any) {
    console.error("PATCH task error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a task
export async function DELETE(req: NextRequest) {
  try {
    // Get token from header
    const token = extractBearerToken(req);
    if (!token) {
      console.error("No authorization token provided in request");
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
    }
    
    // Verify token and get user_id using the utility function
    const userId = await verifyToken(token);
    console.log("API DELETE task - User ID extraction:", userId ? "Found" : "Not found");
    
    if (!userId) {
      console.error("Invalid or expired token");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    
    // Get direct database access
    const supabase = await getDirectSupabaseClient();
    
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
      console.error("Task deletion error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("DELETE task error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
