import { createClient } from "@supabase/supabase-js";

export default async function handler(_req: any, res: any) {
  try {
    const url = process.env.VITE_SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;

    if (!url) {
      return res.status(500).json({
        success: false,
        error: "VITE_SUPABASE_URL tidak ditemukan"
      });
    }

    if (!secret) {
      return res.status(500).json({
        success: false,
        error: "SUPABASE_SECRET_KEY tidak ditemukan"
      });
    }

    const supabase = createClient(url, secret);

    const { data, error } = await supabase
      .from("keep_alive")
      .select("id")
      .eq("id", 1)
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}