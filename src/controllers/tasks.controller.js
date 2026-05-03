import { supabaseAdmin } from "../config/supabase.js";

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.status(200).json({ tasks: data });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// CREATE task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .insert({ user_id: req.user.id, title, description })
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: "Task created", task: data });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE task (title, description or toggle completed)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const { data, error } = await supabaseAdmin
      .from("tasks")
      .update({ title, description, completed })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    if (!data) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated", task: data });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) return res.status(400).json({ message: error.message });

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
