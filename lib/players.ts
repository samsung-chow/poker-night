export type Session = {
  sid: number;
  playerid: number;
  gameid: number;
  profitloss: number;
  date: string;
};

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




