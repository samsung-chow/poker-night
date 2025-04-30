'use client';
import {useState, useEffect, useCallback} from 'react';
import { calculateStatsFromSessions } from '../../lib/players';

export default function Home() {
    const [emailModalOpen, setEmailModalOpen] = useState(true);
    const [playerEmail, setPlayerEmail] = useState("");
    const [playerId, setPlayerId] = useState(0);
    const [playerName, setPlayerName] = useState("");
    const [playerStats, setPlayerStats] = useState({totalProfit: 0,
        avgProfit: 0,
        numSessions: 0,
        stdDev: 0, 
        winRate: 0,
        maxProfit: 0,
        maxLoss: 0,
        longestWinStreak: 0,
        longestLoseStreak: 0,
        currentWinStreak: 0,
        currentLoseStreak: 0,});

    const [inputEmail, setInputEmail] = useState("");

    const handleLogin = useCallback(async () => {
        const response = await fetch(`/api/players/email-to-pid?email=${inputEmail}`);
        const data = await response.json();

        if (data.success) {
            setInputEmail("");
            setPlayerId(data.playerid);
            setPlayerEmail(inputEmail);
            setPlayerName(data.name);
            setEmailModalOpen(false);



            // fetch player info
            const res = await fetch('/api/players/stats', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playerId: data.playerid }),
              });

              const playerData = await res.json();
                if (playerData.success) {
                    const stats = calculateStatsFromSessions(playerData.sessions);
                    console.log("Player Stats:", stats);
                    setPlayerStats(stats);
                } else {
                    alert("Error here: " + playerData.error);
                }

        } else {
            alert("Error: " + data.error);
        }
    }, [inputEmail])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
      
          // 'Enter' confirms (only if one modal is open)
          if (e.key === 'Enter') {
            if (emailModalOpen) handleLogin();
          }
      
          // 'Escape' closes whichever modal is open
          else if (e.key === 'Escape') {
            if (emailModalOpen) setEmailModalOpen(false);
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [emailModalOpen, handleLogin]);


    return(
        <>
        <div className='p-2'>{`your name is ${playerName}`}</div>
        <div className='p-2'>{`your email is ${playerEmail}`}</div>
        <div className='p-2'>{`your player id is ${playerId}`}</div>
        <div className='p-2'>{`Total Profit: ${Number(playerStats.totalProfit.toFixed(2))}`}</div>
        <div className='p-2'>{`Average Profit: ${playerStats.avgProfit}`}</div>
        <div className='p-2'>{`Number of Sessions: ${Number(playerStats.numSessions.toFixed(2))}`}</div>
        <div className='p-2'>{`Standard Deviation: ${Number(playerStats.stdDev.toFixed(4))}`}</div>
        <div className='p-2'>{`Win Rate: ${Number(playerStats.winRate.toFixed(4))}`}</div>
        <div className='p-2'>{`Max Profit: ${Number(playerStats.maxProfit.toFixed(2))}`}</div>
        <div className='p-2'>{`Max Loss: ${Number(playerStats.maxLoss.toFixed(2))}`}</div>
        <div className='p-2'>{`Longest Win Streak: ${playerStats.longestWinStreak}`}</div>
        <div className='p-2'>{`Longest Lose Streak: ${playerStats.longestLoseStreak}`}</div>
        <div className='p-2'>{`Current Win Streak: ${playerStats.currentWinStreak}`}</div>
        <div className='p-2'>{`Current Lose Streak: ${playerStats.currentLoseStreak}`}</div>

        <button 
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-blue-500 transition-colors"
            onClick={() => setEmailModalOpen(true)}
          >
            Change Email
          </button>


        {emailModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-black w-80">
            <h2 className="text-lg font-semibold mb-2">Enter Email</h2>
            <input
              type="string"
              className="border w-full px-3 py-2 rounded mb-4"
              placeholder="email"
              onChange={(e) => setInputEmail(e.target.value)}
              autoFocus
            />
            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleLogin}
              >
                Confirm
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setEmailModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        </>
    )

}
