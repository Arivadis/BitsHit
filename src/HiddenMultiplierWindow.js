import React, { useState, useEffect } from 'react';
import './HiddenMultiplierWindow.css';

function HiddenMultiplierWindow({ visible, onClose, onSave }) {
  const [localMultUp, setLocalMultUp] = useState(100);
  const [localMultDown, setLocalMultDown] = useState(100);
  const [localAfterEntryUp, setLocalAfterEntryUp] = useState(100);
  const [localAfterEntryDown, setLocalAfterEntryDown] = useState(100);

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible]);

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleSave = () => {
    onSave({
      multUp: localMultUp,
      multDown: localMultDown,
      afterEntryUp: localAfterEntryUp,
      afterEntryDown: localAfterEntryDown,
    });
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="hidden-multiplier-window">
      <div className="hidden-multiplier-content">
        <h2>Adjust Multipliers</h2>
        <label>
          Multiplier Up:
          <input
            type="number"
            value={localMultUp}
            onChange={(e) => setLocalMultUp(Number(e.target.value))}
          />
        </label>
        <label>
          Multiplier Down:
          <input
            type="number"
            value={localMultDown}
            onChange={(e) => setLocalMultDown(Number(e.target.value))}
          />
        </label>
        <label>
          After Entry Up:
          <input
            type="number"
            value={localAfterEntryUp}
            onChange={(e) => setLocalAfterEntryUp(Number(e.target.value))}
          />
        </label>
        <label>
          After Entry Down:
          <input
            type="number"
            value={localAfterEntryDown}
            onChange={(e) => setLocalAfterEntryDown(Number(e.target.value))}
          />
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default HiddenMultiplierWindow;
