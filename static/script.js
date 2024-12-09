document.addEventListener('DOMContentLoaded', function() {
    const enhanceBtn = document.getElementById('enhanceBtn');
    const userInput = document.getElementById('userInput');
    
    // Function to handle enhancement
    async function enhanceText() {
        const userInputValue = userInput.value;
        const translateCheck = document.getElementById('translateCheck').checked;
        const grammarCheck = document.getElementById('grammarCheck').checked;
        const flowCheck = document.getElementById('flowCheck').checked;
        const additionalRequests = document.getElementById('additionalRequests').value;
        
        if (!userInputValue) {
            alert('Please enter some text to enhance.');
            return;
        }

        enhanceBtn.disabled = true;
        enhanceBtn.textContent = 'Processing...';

        try {
            const response = await fetch('/enhance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: userInputValue,
                    translate: translateCheck,
                    improveGrammar: grammarCheck,
                    improveFlow: flowCheck,
                    additionalRequests: additionalRequests
                })
            });

            const data = await response.json();
            
            if (data.success) {
                document.getElementById('outputText').value = data.enhancedText;
            } else {
                throw new Error(data.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing the text. Please try again.');
        } finally {
            enhanceBtn.disabled = false;
            enhanceBtn.textContent = 'Enhance Text';
        }
    }

    // Handle button click
    enhanceBtn.addEventListener('click', enhanceText);

    // Handle command+enter
    userInput.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            enhanceText();
        }
    });
});
