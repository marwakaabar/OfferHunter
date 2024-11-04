import { useState, useRef } from 'react';
import axios from '../axios';
import { useHistory } from 'react-router-dom'; // Import useHistory
import LeftNav from '../components/LeftNav';

const AddArticle = () => {
    const [submitted, setSubmitted] = useState(false); // State to track submission
    const titleRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();
    const tagsRef = useRef();
    const history = useHistory(); // Initialize history for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        const title = titleRef.current.value;
        const description = descriptionRef.current.value;
        const image = imageRef.current.files[0]; // Get the file from input
        const tags = tagsRef.current.value.split(',').map(tag => tag.trim());

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image); // Append the image file
        formData.append('tags', tags); // Append the tags

        try {
            await axios.post('/api/articles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSubmitted(true); // Set submission state to true
            history.push('/article'); // Redirect to the article list page
        } catch (error) {
            console.error('Error adding the article:', error);
        }

        // Clear input fields
        titleRef.current.value = '';
        descriptionRef.current.value = '';
        imageRef.current.value = '';
        tagsRef.current.value = '';
    };

    return (
        <div className="contact-p-container">
            <LeftNav />
            <div className="contact-page">
                {submitted ? <h1>Article Added Successfully!</h1> :
                    <div>
                        <br />
                        <h1>Add an Article:</h1>
                        <form className="message-form" onSubmit={handleSubmit}>
                            <br /><br />
                            <input className="message-fields" placeholder='Title' ref={titleRef} required />
                            <br /><br />
                            <textarea className="message" placeholder='Description' ref={descriptionRef} required></textarea>
                            <br /><br />
                            <input type="file" className="message-fields" ref={imageRef} accept="image/*" required /> {/* File input for image */}
                            <br /><br />
                            <input className="message-fields" placeholder='Tags (separated by commas)' ref={tagsRef} required />
                            <br /><br />
                            <button type="submit">Add</button>
                        </form>
                    </div>}
            </div>
        </div>
    );
};

export default AddArticle;
