
import React from 'react';

function FRQDisplay() {
  // Placeholder for FRQ content
  const frq = {
    title: "Sample FRQ Title",
    description: "This is a sample FRQ description. Students will need to implement a method based on the requirements outlined here.",
    methodSignature: "public int sampleMethod(String input)"
  };

  return (
    <div>
      <h2>{frq.title}</h2>
      <p>{frq.description}</p>
      <code>{frq.methodSignature}</code>
    </div>
  );
}

export default FRQDisplay;
