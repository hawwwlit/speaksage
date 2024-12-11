document.getElementById('enhanceBtn').addEventListener('click', async () => {
    const text = document.getElementById('userInput').value;
    const translate = document.getElementById('translateCheck').checked;
    const improveGrammar = document.getElementById('grammarCheck').checked;
    const improveFlow = document.getElementById('flowCheck').checked;
    const additionalRequests = document.getElementById('additionalRequests').value;
  
    // Retrieve the OpenAI API key from storage
    chrome.storage.sync.get(['OPENAI_API_KEY'], async (result) => {
      const apiKey = result.OPENAI_API_KEY;
      if (!apiKey) {
        alert('Please set your OpenAI API Key in the extension options.');
        return;
      }
  
      let currentText = text;
      const messages = [];
  
      // Handle translation if needed
      if (translate) {
        messages.push({
          role: "user",
          content: "Translate the following Chinese to English:\n\n" + currentText
        });
      } else {
        currentText = text;
      }
  
      // Construct the enhancement prompt
      if (improveGrammar || improveFlow || additionalRequests) {
        let prompt = "Rephrase the following";
        if (improveGrammar && improveFlow) {
          prompt += " to improve the grammar and flow";
        } else if (improveGrammar) {
          prompt += " to improve the grammar";
        } else if (improveFlow) {
          prompt += " to improve the flow";
        }
  
        if (additionalRequests) {
          prompt += ` with the following additional requirements: ${additionalRequests}`;
        }
  
        prompt += `:\n\n${currentText}`;
        messages.push({
          role: "user",
          content: prompt
        });
      } else {
        messages.push({
          role: "user",
          content: currentText
        });
      }
  
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
          })
        });
  
        const result = await response.json();
        if (result.choices && result.choices.length > 0) {
          document.getElementById('outputText').value = result.choices[0].message.content.trim();
        } else if (result.error) {
          document.getElementById('outputText').value = 'Error: ' + result.error.message;
        } else {
          document.getElementById('outputText').value = 'An unknown error occurred.';
        }
      } catch (error) {
        document.getElementById('outputText').value = 'Error: ' + error.message;
      }
    });
  });