import { createClient } from "@supabase/supabase-js";

export default async function handler(_req: any, res: any) {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.SUPABASE_SECRET_KEY!
  );

  const { data, error } = await supabase
    .from("keep_alive")
    .select("id")
    .eq("id", 1)
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }

  return res.status(200).json({
    success: true,
    data,
  });
}