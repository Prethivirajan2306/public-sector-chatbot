import { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [messages, setMessages] = useState([
    {
      id: generateId(),
      role: 'bot',
      text: "Hello! I'm your Organizational Assistant. I can help answer questions about HR policies, IT support, and company events. You can also upload a PDF (like a policy document or memo) to get a quick summary. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const getBotResponse = async (userText) => {
    const textLower = userText.toLowerCase();
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200));

    if (textLower.includes('leave') || textLower.includes('hr')) {
      return "According to the HR policy:\n- You have 20 days of paid annual leave.\n- Sick leaves require a medical certificate if exceeding 2 consecutive days.\n- To apply, please log into the internal HR portal and navigate to 'My Leaves'.";
    }
    
    if (textLower.includes('it') || textLower.includes('password') || textLower.includes('vpn')) {
      return "For IT support:\n- Password resets can be done via the self-service portal at `id.org.internal`.\n- For VPN issues, ensure Cisco AnyConnect is updated. If issues persist, raise a ticket via the IT Helpdesk portal or call extension 5555.";
    }
    
    if (textLower.includes('event') || textLower.includes('townhall')) {
      return "Upcoming Company Events:\n1. Q3 Townhall - Friday, 10:00 AM (Main Auditorium)\n2. Annual Day Celebration - Next Month (Details pending HR announcement).";
    }

    return "I'm not exactly sure how to answer that. Could you try rephrasing? I can assist with HR policies, IT support, company events, or summarize uploaded PDFs.";
  };

  const handleSendMessage = async (text) => {
    const userMsg = {
      id: generateId(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const replyText = await getBotResponse(text);
    
    setMessages(prev => [...prev, {
      id: generateId(),
      role: 'bot',
      text: replyText,
      timestamp: Date.now()
    }]);
    setLoading(false);
  };

  const handlePdfParsed = async (filename, extractedText, error = null) => {
    if (error) {
      setMessages(prev => [...prev, 
        { id: generateId(), role: 'user', text: `📎 Uploaded: ${filename}`, timestamp: Date.now() },
        { id: generateId(), role: 'bot', text: `Sorry, I couldn't read that PDF. Error: ${error}`, timestamp: Date.now() }
      ]);
      return;
    }

    // Add user message for upload
    setMessages(prev => [...prev, {
      id: generateId(),
      role: 'user',
      text: `📎 Uploaded Document: ${filename}`,
      timestamp: Date.now()
    }]);
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // simulate thinking

    // Basic summary logic (naive keyword extraction + truncation)
    const preview = extractedText.substring(0, 300) + '...';
    const numWords = extractedText.split(/\s+/).length;
    
    const replyText = `I've analyzed **${filename}**.\n\n**Document Stats:** ~${numWords} words.\n\n**Brief Summary/Preview:**\n"${preview}"\n\nIs there anything specific you would like to know about this document?`;

    setMessages(prev => [...prev, {
      id: generateId(),
      role: 'bot',
      text: replyText,
      timestamp: Date.now()
    }]);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="org-logo">🏢</div>
        <div className="header-text">
          <h1>OrgAssist</h1>
          <p>Public Sector Internal Assistant</p>
        </div>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <ChatWindow messages={messages} loading={loading} />
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onPdfParsed={handlePdfParsed}
          disabled={loading}
        />
      </main>
    </div>
  );
}

export default App;
