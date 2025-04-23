'use client';
// import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [players, setPlayers] = useState([
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
    { name: "default", buyIn: 0, email: "", stack: "", cashout: 0,},
  ]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // This message might not be displayed in some browsers as they use their own standard message
      const message = "refreshing will delete all data. are you sure?";
      e.preventDefault();
      return message; // For modern browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [players]); // Re-run if players state changes

  // update function 
  const updatePlayer = (index: number, field: string, value: string | number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
  };
  const updatePlayerAndCashout = (index: number, stack: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], cashout: stack - updatedPlayers[index].buyIn,
      stack: stack.toString() // Convert stack to string
    };
    setPlayers(updatedPlayers);
  }

  // Function to reset all players
  const resetAllPlayers = () => {
    setPlayers(players.map(player => ({ name: "default", buyIn: 0, email: "", stack: "", cashout: 0})));
    // <Link href="/"></Link>
  };

  // Calculate totals
  const totalBuyIns = players.reduce((sum, player) => sum + player.buyIn, 0);
  const nightTotal = players.reduce((sum, player) => sum + player.cashout, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <PlaceHolderTitles />

      {players.map((player, index) => (
        <PlaceHolderInputs
          key={index}
          name={player.name}
          buyIn={player.buyIn}
          stack={player.stack}
          cashout={player.cashout}
          onNameChange={(value) => updatePlayer(index, 'name', value)}
          onBuyInChange={(value) => updatePlayer(index, 'buyIn', value)}
          onStacksizeChange={(value) => updatePlayerAndCashout(index, value)}
        />
      ))}

      <PlaceHolderTotals 
        onResetClick={resetAllPlayers}
        totalBuyIns={totalBuyIns}
        nightTotal={nightTotal}
      />
    </div>
  );
}

const StandardButton = () => {
  return (
    <button className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
      + / -
    </button>
  );
}

const StandardButton_r = () => {
  return (
    <button className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
      Reset
    </button>
  );
}

interface StandardTextBoxProps {
  onInputChange: (value: number) => void;
  stack: string;
}

const StandardTextBox = ({ onInputChange, stack }: StandardTextBoxProps) => {
  return (
    <input
      type="text"
      value={stack ?? ""}
      className="px-3 py-2 w-20 rounded bg-gray-800 text-white border border-gray-600 text-center"
      onChange={(e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
          // Handle valid number input
          console.log(`Cashout updated: ${value}`);
          onInputChange(value);
        } else {
          // Handle invalid input
          console.log("Invalid cashout value");
          onInputChange(0); // Reset to 0 or handle as needed
        }
      }} 
    />
  );
}

interface PlaceHolderInputsProps {
  name: string;
  buyIn: number;
  stack: string;
  cashout: number;
  onNameChange: (value: string) => void;
  onBuyInChange: (value: number) => void;
  onStacksizeChange: (value: number) => void;
}

const PlaceHolderInputs = ({ name, buyIn, cashout, stack, onNameChange, onBuyInChange, onStacksizeChange}: PlaceHolderInputsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputAmount, setInputAmount] = useState("");

  const handleChanges = () => {
    console.log(`Amount added: ${inputAmount}, New total: ${buyIn + inputAmount}`);
    const parsedAmount = parseFloat(inputAmount) || 0;
    onBuyInChange(buyIn + parsedAmount);
    setInputAmount("");
    setIsModalOpen(false);
  }
  const handleStacksizeChange = (stacksize: number) => {
    console.log(`Stacksize updated to ${stacksize}`);
    onStacksizeChange(stacksize);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleChanges(); // confirm on Enter
      } else if (e.key === 'Escape') {
        setIsModalOpen(false); // cancel on Esc
      }
    };
  
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // cleanup
    };
  }, [isModalOpen, inputAmount]);

  return(
    <>
      <div className="flex flex-row items-center justify-center bg-amber-950 py-1 gap-x-2">
        <div className="w-50 text-left px-5">{`${name}`}</div>
        <div className="w-32 text-center">{`$${buyIn}`}</div>
        <div className="w-32 text-center" onClick={() => setIsModalOpen(true)} ><StandardButton /></div>

        <div className="w-32 text-center">
          <StandardTextBox 
            onInputChange={handleStacksizeChange}
            stack={stack}
          />
        </div>

        <div className="w-32 text-center">{`$${cashout}`}</div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl text-black w-80">
            <h2 className="text-lg font-semibold mb-2">Adjust Buy-In</h2>
            <input
              type="string"
              className="border w-full px-3 py-2 rounded mb-4"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              autoFocus
            />
            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleChanges}
              >
                Confirm
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface PlaceHolderTotalsProps {
  onResetClick: () => void;
  totalBuyIns: number;
  nightTotal: number;
}

const PlaceHolderTotals = ({ onResetClick, totalBuyIns, nightTotal }: PlaceHolderTotalsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChanges = () => {
    console.log(`Reset!`);
    onResetClick();
    setIsModalOpen(false);
  }
  return(
    <>
      <div className="flex flex-row items-center justify-center bg-cyan-500 py-1 gap-x-2">
        <div className="w-50 text-center"> Totals: </div>
        <div className="w-32 text-center">{`$${totalBuyIns}`}</div>
        <div className="w-32 text-center" onClick={() => setIsModalOpen(true)} > <StandardButton_r /> </div>
        <div className="w-32 text-center"></div>
        <div className="w-32 text-center">{`$${nightTotal}`}</div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl text-black w-80">
            <h2 className="text-lg font-semibold mb-2">Confirm Reset?</h2>
            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleChanges}
              >
                Confirm
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

const PlaceHolderTitles = () => {
  return(
    <div className="flex flex-row items-center justify-center bg-blue-400 py-1 gap-x-2">
      <div className="w-50 text-center">Name</div>
      <div className="w-32 text-center">BuyIn</div>
      <div className="w-32 text-center">Rebuy</div>
      <div className="w-32 text-center">Stack</div>
      <div className="w-32 text-center">Cashout</div>
    </div>
  );
}
