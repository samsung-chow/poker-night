import { turso } from "./turso";

export type InsertResult = {
  success: boolean;
  error?: string;
};
export type Session = {
  sid: number;
  playerid: number;
  gameid: number;
  profitloss: number;
};
export type PlayerInfo = {
  playerId: number;
  name: string;
  email: string;
  joinDate: string;
}

// creates a new player
export async function createPlayer(
  name: string, email: string, date: string
): Promise<InsertResult> {
  try {
    await turso.execute({
      sql: `INSERT INTO Players (name, email, joindate) VALUES (?, ?, ?)`,
      args: [name, email, date],
    });
    return { success: true };
  } catch (err: unknown) {
    console.error("Player insert failed:", err);

    let message = "Unknown error";
    if (err instanceof Error && err.message.includes("UNIQUE constraint failed")) {
      message = "email already exists";
    }

    return {
      success: false,
      error: message,
    };
  }
}

// function that returns playerid by email 
export async function getPlayerByEmail(email: string): Promise<number | null> {
  try {
    const result = await turso.execute({
      sql: `SELECT playerid
            FROM Players
            WHERE email = ?`,
      args: [email],
    });

    if (result.rows.length === 0) {
      return null; // Not found
    }

    const row = result.rows[0];
    console.log("Row:", row);
    return row.playerid as number;
  } catch (err: unknown) {
    // Optional: log to console for dev
    console.error("Player insert failed:", err);

    return null; // Error occurred
  }
}

// function that returns player information 
export async function getPlayerInfo(playerId: number): Promise<PlayerInfo | null> {
  try {
    const res = await turso.execute({
      sql: `SELECT * FROM Players WHERE playerid = ?`,
      args: [playerId],
    });
    if (res.rows.length === 0) {
      console.log("Player not found");
      return null; // Not found
    }
    const row = res.rows[0];
    console.log("Row:", row);
    return {
      playerId: row.playerid as number,
      name: row.name as string,
      email: row.email as string,
      joinDate: row.joindate as string,
    };
  } catch (err: unknown) {
    console.error("Player fetch failed:", err);
    return null; // Error occurred
  }
}

// get player session stats
export async function getSessionsForPlayer(playerId: number): Promise<Session[] | null> {
  try {
    const result = await turso.execute({
      sql: "SELECT * FROM Sessions WHERE playerid = ?",
      args: [playerId],
    });
    console.log("Result:", result);

    // Cast each row individually to match the Session type
    const sessions = result.rows.map(row => ({
      sid: row.sid as number,
      playerid: row.playerid as number,
      gameid: row.gameid as number,
      profitloss: row.profitloss as number,
    }));

    return sessions;

  } catch (err: unknown) {
    // Optional: log to console for dev
    console.error("Session fetch failed:", err);
    return null; // Error occurred
  }
}

// player stats function 
export function calculateStatsFromSessions(sessions: Session[]) {
  const totalProfit = sessions.reduce((sum, s) => sum + s.profitloss, 0);
  const avgProfit = totalProfit / sessions.length;
  const numSessions = sessions.length;

  // Standard deviation
  const variance =
    sessions.reduce((sum, s) => sum + Math.pow(s.profitloss - avgProfit, 2), 0) /
    numSessions;
  const stdDev = Math.sqrt(variance);

  // Win rate (sessions with profit > 0)
  const wins = sessions.filter(s => s.profitloss > 0).length;
  const winRate = wins / numSessions;

  const maxProfit = Math.max(...sessions.map(s => s.profitloss));
  const maxLoss = Math.min(...sessions.map(s => s.profitloss));

  // longest and current win streak
  let longestWinStreak = 0;
  let currentWinStreak = 0;
  sessions.forEach(session => {
    if (session.profitloss > 0) {
      currentWinStreak++;
      longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
    } else {
      currentWinStreak = 0;
    }
  });

  // longest lose streak and days since last win
  let longestLoseStreak = 0;
  let currentLoseStreak = 0;
  sessions.forEach(session => {
    if (session.profitloss < 0) {
      currentLoseStreak++;
      longestLoseStreak = Math.max(longestLoseStreak, currentLoseStreak);
    } else {
      currentLoseStreak = 0;
    }
  });

  console.log("Total Profit:", totalProfit);
  console.log("Average Profit:", avgProfit);
  console.log("Number of Sessions:", numSessions);
  console.log("Standard Deviation:", stdDev);
  console.log("Win Rate:", winRate);
  console.log("Max Profit:", maxProfit);
  console.log("Max Loss:", maxLoss);
  console.log("Longest Win Streak:", longestWinStreak);
  console.log("Longest Lose Streak:", longestLoseStreak);
  console.log("Current Win Streak:", currentWinStreak);
  console.log("Current Lose Streak:", currentLoseStreak);

  return {
    totalProfit: totalProfit,
    avgProfit: avgProfit,
    numSessions: numSessions,
    stdDev: stdDev, 
    winRate: winRate,
    maxProfit: maxProfit,
    maxLoss: maxLoss,
    longestWinStreak: longestWinStreak,
    longestLoseStreak: longestLoseStreak,
    currentWinStreak: currentWinStreak,
    currentLoseStreak: currentLoseStreak,
  };
}

// final wrapper function
export async function getPlayerStats(playerId: number) {
  const sessions = await getSessionsForPlayer(playerId);

  if (!sessions) {
    return null; // or return default stats, or throw an error
  }

  return calculateStatsFromSessions(sessions);
}





