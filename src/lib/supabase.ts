import { createClient as createSupabaseClientInner } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Function to obtain the configuration
const getSupabaseConfig = () => {
  // Check if we are client-side
  if (typeof window !== "undefined") {
    // Retrieve values from localStorage
    const url = localStorage.getItem("supabase_url")
    const key = localStorage.getItem("supabase_key")

    if (url && key) {
      return { url, key }
    }
  }

  // Fallback to environment variables
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    key: process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
  }
}

// Create a function to initialize the Supabase client
export const createClient = () => {
  // If we are server-side, use environment variables
  if (typeof window === "undefined") {
    return createSupabaseClientInner<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
    )
  }

  // If we are client-side, use localStorage values
  const { url, key } = getSupabaseConfig()
  return createSupabaseClientInner<Database>(url, key)
}

// Create a client admin with the service role key
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createSupabaseClientInner(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY)
  : createClient() // Fallback to the standard client if the service role key is not available

// Helper function to get server-side supabase client with auth context
export const createServerSupabaseClient = async () => {
  const { cookies } = await import("next/headers")
  const cookieStore = cookies()

  return createSupabaseClientInner<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    },
  )
}

export const supabase = createClient()
