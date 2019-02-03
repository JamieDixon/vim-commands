import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const commands = [
  {
    command: 'x',
    description: 'Delete a single character at the cursor',
  },
  {
    command: 'dw',
    description: 'Delete an entire word starting at the cursor',
  },
  {
    command: 'i',
    description: 'Enter insert mode',
  },
  {
    command: 'a',
    description: 'Enter append mode at the cursor',
  },
  {
    command: 'd$',
    description: 'Delete from the cursor to the end of the line',
  },
  {
    command: 'p',
    description:
      'Put the contents of the "clipboard" into the cursor position. You can use this after doing dd to delete a line. Kinda like dd is cut and p is paste',
  },
];

const App = props => {
  const [filteredCommands, setFilteredCommands] = useState(commands);
  const [filterValue, setFilterValue] = useState('');

  // Why is this in useEffect? Just as a reminder for me to debounce this later on
  // I'd probably forget if it was in the event handler itself. ¯\_(ツ)_/¯
  useEffect(() => {
    const nextCommands = commands.filter(command =>
      command.description.toLowerCase().includes(filterValue.toLowerCase()),
    );
    setFilteredCommands(nextCommands);
  }, [filterValue]);

  return (
    <div className="App">
      <header className="App-header">
        <label htmlFor="search">Filter commands</label>
        <input
          type="text"
          id="search"
          onChange={e => setFilterValue(e.target.value)}
          value={filterValue}
        />
        <p>
          The code in this project is all being edited with neovim as part of a
          learning exercise
        </p>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Command</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommands.map(command => (
              <tr>
                <td>{command.description}</td>
                <td><span className="command-char">{command.command}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
};

export default App;
