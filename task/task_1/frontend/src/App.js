import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addMessage, setLoading } from './redux/chatSlice';

function App() {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  
  // Grabbing the state from Redux
  const { messages, loading } = useSelector((state) => state.chat);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Add User Message to Redux UI
    const userMsg = { sender: 'user', text: input };
    dispatch(addMessage(userMsg));
    dispatch(setLoading(true));
    setInput('');

    try {
      // 2. Send to FastAPI Backend (Running on port 8000)
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: input
      });

      // 3. Add AI Response to Redux UI
      dispatch(addMessage({ sender: 'ai', text: response.data.reply }));
    } catch (error) {
      console.error("Backend connection error:", error);
      dispatch(addMessage({ sender: 'ai', text: "Error: Cannot connect to the Brain (Backend)." }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={{ margin: 0 }}>HCP Interaction CRM</h2>
        <small>AI-First Engagement Platform</small>
      </header>

      <div style={styles.chatWindow}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '100px' }}>
            Type a message to start logging an HCP interaction...
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            ...styles.bubble, 
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#007bff' : '#e9e9eb',
            color: msg.sender === 'user' ? 'white' : 'black'
          }}>
            <strong>{msg.sender === 'user' ? 'You' : 'Agent'}:</strong> {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: '#888', fontSize: '12px' }}>Agent is thinking...</div>}
      </div>

      <div style={styles.inputArea}>
        <input 
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="e.g., Log a meeting with Dr. Smith about Paracetamol..."
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

// Simple styling to make it look professional for your video
const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '800px', margin: 'auto', border: '1px solid #ddd' },
  header: { padding: '20px', backgroundColor: '#282c34', color: 'white', textAlign: 'center' },
  chatWindow: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  bubble: { maxWidth: '70%', padding: '10px 15px', borderRadius: '15px', marginBottom: '5px', fontSize: '14px' },
  inputArea: { display: 'flex', padding: '20px', borderTop: '1px solid #ddd' },
  input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { marginLeft: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default App;

// this is for the ui of the ai agent