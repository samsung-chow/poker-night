import { turso } from "./turso";

type InsertResult = {
  success: boolean;
  error?: string;
};

// create an admin account
export async function createAdmin(
  adminid: string, name: string, password: string
): Promise<InsertResult> {
  try {
    await turso.execute({
      sql: `INSERT INTO Admins (adminid, name, password) VALUES (?, ?, ?)`,
      args: [adminid, name, password],
    });
    return { success: true };
  } catch (err: any) {
    // Optional: log to console for dev
    console.error("Insert failed:", err);

    let message = "Unknown error";
    if (err.message?.includes("UNIQUE constraint failed")) {
      message = "Admin ID already exists";
    }

    return {
      success: false,
      error: message,
    };
  }
}



