document.addEventListener('DOMContentLoaded', function() {
    const enhanceBtn = document.getElementById('enhanceBtn');
    
    enhanceBtn.addEventListener('click', async function() {
        const userInput = document.getElementById('userInput').value;
        const grammarCheck = document.getElementById('grammarCheck').checked;
        const flowCheck = document.getElementById('flowCheck').checked;
        const additionalRequests = document.getElementById('additionalRequests').value;
        
        if (!userInput) {
            alert('Please enter some text to enhance.');
            return;
        }

        enhanceBtn.disabled = true;
        enhanceBtn.textContent = 'Enhancing...';

        try {
            const response = await fetch('/enhance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: userInput,
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
            alert('An error occurred while enhancing the text. Please try again.');
        } finally {
            enhanceBtn.disabled = false;
            enhanceBtn.textContent = 'Enhance Text';
        }
    });
}); 