
import React, { useState } from 'react';

function JavaEditor() {
  const [code, setCode] = useState('// Start your Java code here');

  return (
    <div>
      <h3>Java Editor</h3>
      <textarea 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        rows="20" 
        cols="80"
        style={{ fontFamily: 'monospace', fontSize: '14px' }}
      />
    </div>
  );
}

export default JavaEditor;
