
import React from 'react';

function Controls() {
  const handleGenerateNew = () => {
    console.log("Generate New FRQ clicked");
    // Logic to fetch/generate a new FRQ will go here
  };

  const handleSubmit = () => {
    console.log("Submit Code clicked");
    // Logic to submit/evaluate code will go here
  };

  return (
    <div>
      <button onClick={handleGenerateNew}>Generate New FRQ</button>
      <button onClick={handleSubmit}>Submit Code</button>
    </div>
  );
}

export default Controls;
