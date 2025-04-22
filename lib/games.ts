import { turso } from "./turso";
export type InsertResult = {
  success: boolean;
  error?: string;
};

// given game date, buyin, and hostid create game in database
export async function createGame(
  date: string, buyin: number, hostid: string
): Promise<InsertResult> {
  try {
    await turso.execute({
      sql: `INSERT INTO Games (date, buyin, host) VALUES (?, ?, ?)`,
      args: [date, buyin, hostid],
    });
    return { success: true };
  }
  catch (err: any) {
    console.error("Game insert failed:", err);

    let message = "Unknown error";
    if (err.message?.includes("UNIQUE constraint failed")) {
      message = "Game already exists";
    }
    return {
      success: false,
      error: message,
    };
  }
}

// given playerid, gameid, profitloss, create game sesion
export async function createGameSession(
  playerid: number, gameid: number, profitloss: number
): Promise<InsertResult> {
  try {
    await turso.execute({
      sql: `INSERT INTO Sessions (playerid, gameid, profitloss) VALUES (?, ?, ?)`,
      args: [playerid, gameid, profitloss],
    });
    return { success: true };
  }
  catch (err: any) {
    console.error("Game session insert failed:", err);

    let message = "Unknown error";
    if (err.message?.includes("UNIQUE constraint failed")) {
      message = "Game session already exists";
    }
    return {
      success: false,
      error: message,
    };
  }
}


