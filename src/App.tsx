// Import necessary dependencies from React and external libraries
import React, { useState } from 'react';
import axios from 'axios';

// Define a functional component named App using React.FC (Functional Component)
const App: React.FC = () => {
    // State declarations using the useState hook to manage 'note' and 'message'
    const [note, setNote] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    // Asynchronous function to save the note using axios to make a POST request
    const saveNote = async () => {
        try {
            // Await the completion of the POST request to the specified API endpoint
            await axios.post('http://localhost:5000/api/notes', { text: note });

            // If successful, update the 'message' state with a success message
            setMessage('Note saved successfully');
        } catch (error) {
            // If an error occurs during the POST request, update the 'message' state with an error message
            setMessage('Error saving note');
        }
    };

    // JSX rendering of the component
    return (
        <div>
            {/* Display a heading */}
            <h1>The CG MERN Stack with TypeScript Playground</h1>

            <div>
                {/* Textarea for inputting the note, controlled by the 'note' state */}
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Type your note here"
                />
            </div>

            <div>
                {/* Button to trigger the saveNote function when clicked */}
                <button onClick={saveNote}>Save Note</button>
            </div>

            {/* Display the 'message' only if it is not an empty string */}
            {message && <div>{message}</div>}
        </div>
    );
};

// Export the App component as the default export of this module
export default App;
