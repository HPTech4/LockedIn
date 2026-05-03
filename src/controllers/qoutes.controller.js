import { supabaseAdmin } from "../config/supabase.js";

// GET all quotes
export const getQuotes = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("quotes")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.status(200).json({ quotes: data });
  } catch (err) {
    console.error("Get quotes error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// CREATE quote
export const createQuote = async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text)
      return res.status(400).json({ message: "Quote text is required" });

    const { data, error } = await supabaseAdmin
      .from("quotes")
      .insert({ user_id: req.user.id, text, author })
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: "Quote saved", quote: data });
  } catch (err) {
    console.error("Create quote error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE quote
export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from("quotes")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) return res.status(400).json({ message: error.message });

    res.status(200).json({ message: "Quote deleted" });
  } catch (err) {
    console.error("Delete quote error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
