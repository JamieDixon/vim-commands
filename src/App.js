import React, {useState, useEffect} from 'react';

const getQs = () =>
  window.location.search
    .slice(1)
    .split('&')
    .map(x => x.split('='))
    .reduce((agg, [key, val]) => ({...agg, [key]: val}), {});

const commands = [
  {
    command: [':', 'q', '!'],
    description: 'Exit / quit vim, disgarding all changes',
  },
  {command: [':', 'w'], description: 'Save your changes (write)'},
  {
    command: [':', 'w', 'q'],
    description: 'Save your changes (write) and exit / quit vim',
  },
  {
    command: ['x'],
    description: 'Delete a single character at the cursor',
  },
  {
    command: ['d', 'w'],
    description: 'Delete an entire word starting at the cursor',
  },
  {
    command: ['i'],
    description: 'Enter insert mode',
  },
  {
    command: ['a'],
    description: 'Enter append mode at the cursor',
  },
  {
    command: ['d', '$'],
    description: 'Delete from the cursor to the end of the line',
  },
  {
    command: ['p'],
    description:
      'Put the contents of the "clipboard" into the cursor position. You can use this after doing dd to delete a line. Kinda like dd is cut and p is paste',
  },
  {
    command: ['r'],
    description:
      'Replace the letter at the cursor. Press r then the letter to insert.',
  },
  {
    command: ['c', 'e'],
    description:
      'Delete the current word beginning at the cursor and enter insert mode',
  },
  {
    command: ['G'],
    description: 'Go to the bottm of the file',
  },
  {
    command: ['g', 'g'],
    description: 'Go to the top of the file',
  },
  {
    command: ['[line number]', 'G'],
    description: 'Go to the line in question i.e. 200G',
  },
  {
    command: ['d', 'd'],
    description:
      'Delete the current line and store the deleted value in the registry (kinda like the clipboard).',
  },
];

const useDebounce = (ms, value) => {
  const [v, sv] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => sv(value), ms);

    return () => clearTimeout(timer);
  }, [value]);

  return v;
};

const any = a => b => a.reduce((agg, next) => agg || b.includes(next), false);

const App = props => {
  const [filteredCommands, setFilteredCommands] = useState(commands);
  const [filterValue, setFilterValue] = useState(getQs().q || '');
  const bouncedFilterValue = useDebounce(500, filterValue);

  useEffect(() => {
    if (!filterValue) {
      setFilteredCommands(commands);
      return;
    }

    // Very basic relevancy search based on the number of matching words
    const valueWords = filterValue
      .toLowerCase()
      .trim()
      .split(' ');
    const nextCommands = commands
      .map(command => {
        const relevancy = command.description
          .toLowerCase()
          .trim()
          .split(' ')
          .reduce(
            (agg, word) =>
              valueWords.includes(word) || any(valueWords)(command.command)
                ? agg + 1
                : agg,
            0,
          );

        return {
          ...command,
          relevancy,
        };
      })
      .filter(command => command.relevancy > 0)
      .sort((a, b) => b.relevancy - a.relevancy);
    setFilteredCommands(nextCommands);
  }, [bouncedFilterValue]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Vim Commands</h2>
      </header>
      <label htmlFor="search">Filter commands</label>
      <input
        type="text"
        id="search"
        onChange={e => setFilterValue(e.target.value)}
        value={filterValue}
      />
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Command</th>
          </tr>
        </thead>
        <tbody>
          {filteredCommands.map(command => (
            <tr key={command.command.join('')}>
              <th>{command.description}</th>
              <td>
                {command.command.map(c => (
                  <span className="command-char">{c}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        The code in this project is all being edited with neovim as part of a
        learning exercise
      </p>
      <p>
        <a href="https://codesandbox.io/s/github/JamieDixon/vim-commands">
          view the full source on codesandbox.io
        </a>
      </p>
    </div>
  );
};

export default App;
