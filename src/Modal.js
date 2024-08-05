import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, CircularProgress, Box } from '@mui/material';
import './Modal.css';

function Modal({ onContinue }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const [canContinueBut, setCanContinueBut] = useState(false);

  useEffect(() => {
    // Update canContinue based on username validity and error status
    if (username.length >= 5 && !error) {
      setCanContinue(true);
    } else {
      setCanContinue(false);
    }
  }, [username, error]);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length < 5) {
      setError('Name must be at least 5 chars');
    } else {
      setError('');
    }
  };

  const handleDeposit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMessage('It is not possible to deposit now, please try later.');
      setIsLoading(false);
    }, 2000);
  };

  const handleTakeLoan = () => {
    setIsLoading(true);
    setMessage('');
    setTimeout(() => setMessage('Processing...'), 1000);
    setTimeout(() => setMessage('Getting bank details...'), 2000);
    setTimeout(() => {
      setMessage('You deposited now $10,000');
      setIsLoading(false);
      setCanContinueBut(true);

      // Store username and capital in local storage
      localStorage.setItem('username', username);
      localStorage.setItem('capital', '10000');
    }, 3000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Please enter your username</Typography>
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          value={username}
          onChange={handleUsernameChange}
          error={!!error}
          helperText={error}
          InputProps={{ style: { height: '60px', backgroundColor: 'lightgreen' } }} // Adjusted height and background color
          style={{ width: '300px' }} // Adjusted width
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeposit}
            disabled={isLoading}
            style={{ marginRight: '10px', height: '80px', width: '160px' }} // Adjusted size
          >
            Deposit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleTakeLoan}
            disabled={isLoading}
            style={{ height: '80px', width: '160px' }} // Adjusted size
          >
            Take a Loan
          </Button>
        </Box>
        {isLoading && <CircularProgress style={{ marginTop: '10px' }} />}
        {message && <Typography style={{ marginTop: '10px', color: message === 'It is not possible to deposit now, please try later.' ? '#ff4d4d' : 'lightblue', fontWeight: 'bold' }}>{message}</Typography>}
        <Box mt={2}>
          <Button
            variant="contained"
            color="success"
            onClick={onContinue}
            disabled={!canContinue | !canContinueBut}
            style={{
              height: '80px',
              width: '160px',
              opacity: !canContinue | !canContinueBut? 0.5 : 1, // Make button transparent when disabled
              backgroundColor: !canContinue | !canContinueBut? 'rgba(76, 175, 80, 0.5)' : '#4caf50', // Adjust background color
              color: '#fff'
            }}
          >
            Register
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default Modal;
