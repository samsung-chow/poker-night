'use client';

import {useState, useEffect, useCallback} from 'react';

export default function Home() {
  // array that stores player objects
  // player objects contain all useful information
  const [players, setPlayers] = useState([
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
    {name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0},
  ]);

    // confirmation before refresh
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

  // update players each time anything is changed
  const updatePlayer = (index: number, field: string, value: string | number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = {...updatedPlayers[index], 
      [field]: value,
    };
    console.log(`Updated ${field} for player ${index}: ${value}`);
    setPlayers(updatedPlayers);
    const tmp = isNaN(parseFloat(updatedPlayers[index].stack)) ? 0 : parseFloat(updatedPlayers[index].stack);
    updatedPlayers[index] = {...updatedPlayers[index],
      cashout: Number((tmp - updatedPlayers[index].buyin).toFixed(2)),
      stackvalue: tmp // Convert stack to string
    };
    setPlayers(updatedPlayers);
  }
  
  // reset all players
  const resetAllPlayers = () => {
    setPlayers(players.map(_ => ({name: ".none", email: "", buyin: 0, stack: "", cashout: 0, stackvalue: 0})));
    setNumberOfPlayers(0);
    setAddPlayerModalOpen(true);
  }

  // calculating totals
  const totalBuyins = players.reduce((sum, player) => sum + player.buyin, 0);
  const nightTotal = players.reduce((sum, player) => sum + player.cashout, 0);

  // add player modal
  const [addPlayerModalOpen, setAddPlayerModalOpen] = useState(true);
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  
  const handleChanges = useCallback(() => {
    // console.log('Adding new player with name:', inputName, 'email:', inputEmail);
    const newPlayers = [...players];
    newPlayers[numberOfPlayers] = {
    name: inputName,
    email: inputEmail,
    buyin: 0,
    stack: "",
    cashout: 0,
    stackvalue: 0, 
  };
  
    // Set the new array directly
    setPlayers(newPlayers);

    setInputName("");
    setInputEmail("");
    setAddPlayerModalOpen(false);
    setNumberOfPlayers(numberOfPlayers + 1);
    // console.log(`num of players: ${numberOfPlayers}, player 0 name: ${players[0].name}`);
  }, [inputName, inputEmail, numberOfPlayers, players]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleChanges(); // confirm on Enter
      } else if (e.key === 'Escape') {
        setAddPlayerModalOpen(false); // cancel on Esc
      }
    };
  
    if (addPlayerModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // cleanup
    };
  }, [addPlayerModalOpen, inputName, inputEmail, handleChanges]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n') {
        e.preventDefault();
        setAddPlayerModalOpen(true); // add player on 'n'
      }
    };
  
    if (!addPlayerModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // cleanup
    };
  }, [addPlayerModalOpen, inputName, inputEmail, handleChanges]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <PlaceHolderTitles />

        {players.map((player, index) => (
          player.name !== ".none" ? (
          <PlaceHolderInputs
            key={index}
            name={player.name}
            buyIn={player.buyin}
            stack={player.stack}
            cashout={player.cashout}
            onBuyInChange={(value) => updatePlayer(index, 'buyin', value)}
            onStacksizeChange={(value) => updatePlayer(index, 'stack', value)}
          />
        ) : null
        ))}

        <PlaceHolderTotals 
          onResetClick={resetAllPlayers}
          totalBuyIns={totalBuyins}
          nightTotal={nightTotal}
        />

        {numberOfPlayers < 10 && (
          <button 
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-blue-500 transition-colors"
            onClick={() => setAddPlayerModalOpen(true)}
          >
            Add Player
          </button>
        )}
      </div>

      {addPlayerModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-black w-80">
            <h2 className="text-lg font-semibold mb-2">Add new player</h2>
            <input
              type="string"
              className="border w-full px-3 py-2 rounded mb-4"
              placeholder="Name"
              onChange={(e) => setInputName(e.target.value)}
              autoFocus
            />
            <input
              type="string"
              className="border w-full px-3 py-2 rounded mb-4"
              placeholder="Email"
              onChange={(e) => setInputEmail(e.target.value)}
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
                onClick={() => setAddPlayerModalOpen(false)}
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
  onInputChange: (value: string) => void;
  stack: string;
}

const StandardTextBox = ({ onInputChange, stack }: StandardTextBoxProps) => {
  return (
    <input
      type="text"
      value={stack}
      className="px-3 py-2 w-20 rounded bg-gray-700 text-white border border-gray-600 text-center"
      onChange={(e) => {
        onInputChange(e.target.value);
      }} 
    />
  );
}

interface PlaceHolderInputsProps {
  name: string;
  buyIn: number;
  stack: string;
  cashout: number;
  // onNameChange: (value: string) => void;
  onBuyInChange: (value: number) => void;
  onStacksizeChange: (value: string) => void;
}

const PlaceHolderInputs = ({ name, buyIn, cashout, stack, onBuyInChange, onStacksizeChange}: PlaceHolderInputsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputAmount, setInputAmount] = useState("");

  const handleChanges = useCallback(() => {
    console.log(`Amount added: ${inputAmount}, New total: ${buyIn + inputAmount}`);
    const parsedAmount = parseFloat(inputAmount) || 0;
    onBuyInChange(buyIn + parsedAmount);
    setInputAmount("");
    setIsModalOpen(false);
  }, [buyIn, inputAmount, onBuyInChange]);

  const handleStacksizeChange = (stack: string) => {
    console.log(`Stacksize updated to ${stack}`);
    onStacksizeChange(stack);
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
  }, [isModalOpen, inputAmount, handleChanges]);

  return(
    <>
      <div className="flex flex-row items-center justify-center bg-black py-1 gap-x-2">
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
          <div className="bg-white p-6 rounded-2xl shadow-xl text-black w-80">
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

  const handleChanges = useCallback(() => {
    console.log(`Reset!`);
    onResetClick();
    setIsModalOpen(false);
  }, [onResetClick]);

  return(
    <>
      <div className="flex flex-row items-center justify-center bg-gray-900 py-1 gap-x-2">
        <div className="w-50 text-center"> Totals: </div>
        <div className="w-32 text-center">{`$${totalBuyIns}`}</div>
        <div className="w-32 text-center" onClick={() => setIsModalOpen(true)} > <StandardButton_r /> </div>
        <div className="w-32 text-center"></div>
        <div className="w-32 text-center">{`$${nightTotal}`}</div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-black w-80">
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
    <div className="flex flex-row items-center justify-center bg-gray-900 py-1 gap-x-2">
      <div className="w-50 text-center">Name</div>
      <div className="w-32 text-center">BuyIn</div>
      <div className="w-32 text-center">Rebuy</div>
      <div className="w-32 text-center">Stack</div>
      <div className="w-32 text-center">Cashout</div>
    </div>
  );
}
