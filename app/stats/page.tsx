'use client';
import {useState, useEffect, useCallback,} from 'react';
import { calculateStatsFromSessions } from '../../lib/players';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
    const [playerCumulatives, setPlayerCumulatives] = useState([] as Array<{date: string, profitloss: number, cumulative: number}>);
    const [cumulativeGraph, setCumulativeGraph] = useState(10);

    const [inputEmail, setInputEmail] = useState("");
    const [mostRecentSession, setMostRecentSession] = useState({
        date: "",
        buyIn: 0, 
        players: [] as Array<{name: string, profitLoss: number}>,
    });
    const [biggestWinSession, setBiggestWinSession] = useState({
      date: "",
      buyIn: 0, 
      players: [] as Array<{name: string, profitLoss: number}>,
    });
    const [biggestLossSession, setBiggestLossSession] = useState({
      date: "",
      buyIn: 0, 
      players: [] as Array<{name: string, profitLoss: number}>,
    });

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
                    setPlayerStats(stats);
                    console.log("Player Stats:", stats);
                    console.log("Player Sessions:", playerData.sessions);

                    let cum = 0;
                    const data = playerData.sessions.map((s: {
                      sid: number;
                      playerid: number;
                      gameid: number;
                      profitloss: number;
                      date: string;
                    }) => {
                      const entry = {
                        date: s.date,
                        profitloss: s.profitloss,
                        cumulative: cum,
                      };
                      cum += s.profitloss;
                      return entry;
                    });

                    setPlayerCumulatives(data);
                    console.log("Player Cumulatives:", data);

                } else {
                    alert("Error here: " + playerData.error);
                }

        } else {
            alert("Error: " + data.error);
        }

        // most recent game
        const response2 = await fetch(`/api/games/most-recent?pid=${data.playerid}`);
        const data2 = await response2.json();
        if (data2.success) {
            const updateMostRecentSession = {...mostRecentSession};
            updateMostRecentSession.date = data2.sessions[0].date;
            updateMostRecentSession.buyIn = data2.sessions[0].buyin;
            updateMostRecentSession.players = data2.sessions.map((session: {
              sid: number;
              playerid: number;
              profitloss: number;
              name: string;
              date: string;
              buyin: number;
            }) => ({
                name: session.name,
                profitLoss: session.profitloss,
            }));
            setMostRecentSession(updateMostRecentSession);
            console.log("Most Recent Session:", updateMostRecentSession);
        } else {
            alert("Error: " + data2.error);
        }

        // biggest win
        const response3 = await fetch(`/api/games/biggest-win?pid=${data.playerid}`);
        const data3 = await response3.json();
        if (data3.success) {
            const updateBiggestWinSession = {...biggestWinSession};
            updateBiggestWinSession.date = data3.sessions[0].date;
            updateBiggestWinSession.buyIn = data3.sessions[0].buyin;
            updateBiggestWinSession.players = data3.sessions.map((session: {
              sid: number;
              playerid: number;
              profitloss: number;
              name: string;
              date: string;
              buyin: number;
            }) => ({
                name: session.name,
                profitLoss: session.profitloss,
            }));
            setBiggestWinSession(updateBiggestWinSession);
            console.log("Biggest Win Session:", updateBiggestWinSession);
        } else {
            alert("Error: " + data3.error);
        }

        // biggest loss
        const response4 = await fetch(`/api/games/biggest-loss?pid=${data.playerid}`);
        const data4 = await response4.json();
        if (data4.success) {
            // setBiggestLossSession(data4.sessions[0]);
            const updateBiggestLossSession = {...biggestLossSession};
            updateBiggestLossSession.date = data4.sessions[0].date;
            updateBiggestLossSession.buyIn = data4.sessions[0].buyin;
            updateBiggestLossSession.players = data4.sessions.map((session: {
              sid: number;
              playerid: number;
              profitloss: number;
              name: string;
              date: string;
              buyin: number;
            }) => ({
                name: session.name,
                profitLoss: session.profitloss,
            }));
            setBiggestLossSession(updateBiggestLossSession);
            console.log("Biggest Loss Session:", updateBiggestLossSession);
        }
        else {
            alert("Error: " + data4.error);
        }

    }, [inputEmail, mostRecentSession, biggestWinSession, biggestLossSession]);

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
        <div className='flex flex-row'>
          <div className='w-100'>
            <div className='p-2'>{`your name is ${playerName}`}</div>
            <div className='p-2'>{`your email is ${playerEmail}`}</div>
            <div className='p-2'>{`your player id is ${playerId}`}</div>
            <div className='p-2'>{`Total Profit: ${Number(playerStats.totalProfit.toFixed(2))}`}</div>
            <div className='p-2'>{`Average Profit: ${Number(playerStats.avgProfit.toFixed(2))}`}</div>
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
          </div>

          <div className='flex flex-col p-3 w-100'>
            <div className='mb-3'>
              most recent session: {mostRecentSession.date}, buy in: {mostRecentSession.buyIn}

              <div className='pl-2'>
                <div>
                  {mostRecentSession.players.map((player, index) => (
                    <div key={index} className='flex flex-row'>
                      <div>{player.name}</div>
                      <div className='pl-2'>{player.profitLoss}</div>
                    </div>
                  ))}
                  </div>
              </div>
            </div>

            <div className='mb-3'>
              biggest win: {biggestWinSession.date}, buy in: {biggestWinSession.buyIn}

              <div className='pl-2'>
                <div className='pl-2'>
                  {biggestWinSession.players.map((player, index) => (
                    <div key={index} className='flex flex-row'>
                      <div>{player.name}</div>
                      <div className='pl-2'>{player.profitLoss}</div>
                    </div>
                  ))}
                  </div>
              </div>
            </div>
            
            <div className='mb-3'>
              biggest loss: {biggestLossSession.date}, buy in: {biggestLossSession.buyIn}

              <div className='pl-2'>
                <div className='pl-2'>
                  {biggestLossSession.players.map((player, index) => (
                    <div key={index} className='flex flex-row'>
                      <div>{player.name}</div>
                      <div className='pl-2'>{player.profitLoss}</div>
                    </div>
                  ))}
                  </div>
              </div>
            </div>

          </div>

          <div className='p-3 w-200'>
            <div className='flex flex-row'>
              <div>Cumulative profit / loss (most recent {cumulativeGraph} games)</div>
              <div> 
                <button className='pl-2 pr-2  ml-2 mr-2 bg-gray-700 text-white rounded hover:bg-blue-500 transition-colors"'
                onClick={() => setCumulativeGraph(playerCumulatives.length)}> All </button> 
              </div>
              <div> 
                <button className='pl-2 pr-2  ml-2 mr-2 bg-gray-700 text-white rounded hover:bg-blue-500 transition-colors"'
                onClick={() => setCumulativeGraph(50)}> 50 </button> 
              </div>
              <div> 
                <button className='pl-2 pr-2  ml-2 mr-2 bg-gray-700 text-white rounded hover:bg-blue-500 transition-colors"'
                onClick={() => setCumulativeGraph(10)}> 10 </button> 
              </div>
              <div> 
                <button className='pl-2 pr-2  ml-2 mr-2 bg-gray-700 text-white rounded hover:bg-blue-500 transition-colors"'
                onClick={() => setCumulativeGraph(cumulativeGraph + 1)}
                disabled={cumulativeGraph >= playerCumulatives.length}> +1 </button> 
              </div>
              <div> 
                <button className='pl-2 pr-2  ml-2 mr-2 bg-gray-700 text-white rounded hover:bg-blue-500 transition-colors"'
                onClick={() => setCumulativeGraph(cumulativeGraph - 1)}
                disabled={cumulativeGraph <= 1}> -1 </button> 
              </div>
            </div>
            <ResponsiveContainer width="90%" height="50%">
              <BarChart width={800} height={400} data={playerCumulatives.slice(-cumulativeGraph)}>
                <CartesianGrid strokeDasharray="3 3" />

                

                <XAxis 
                  dataKey="date"
                  angle={-90}
                  textAnchor="end"
                  tick={{ fill: '#ccc', fontSize: 12 }}
                  ticks={playerCumulatives
                    .filter((_, index) => index % 2 === 0)
                    .map(d => d.date)}
                  interval={0}
                  height={80}
                />
                
                <YAxis tick={{ fill: '#ccc' }} />

                <Tooltip
                  contentStyle={{ backgroundColor: '#222', border: 'none', color: '#fff' }}
                  labelStyle={{ color: '#aaa' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number, name: string) => {
                    const label = name === 'cumulative' ? 'Base' : 'Sessional';
                    return [`$${value.toFixed(2)}`, label];
                  }}
                />

                {/* base bar (transparent) */}
                <Bar dataKey="cumulative" stackId="a" fill="transparent" />
                
                {/* actual change bar */}
                <Bar dataKey="profitloss" stackId="a">
                  {
                    playerCumulatives.slice(-cumulativeGraph).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.profitloss >= 0 ? '#4CAF50' : '#F44336'} // Green for profit, Red for loss
                      />
                    ))
                  }
                </Bar>


              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


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
              autoCorrect='off'
              autoCapitalize='none'
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

