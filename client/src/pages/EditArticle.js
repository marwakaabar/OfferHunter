import { useState, useEffect } from 'react';
import axios from '../axios';
import { useHistory, useParams } from 'react-router-dom';
import LeftNav from '../components/LeftNav';

const EditArticle = () => {
    const [article, setArticle] = useState({
        title: '',
        description: '',
        image: '',
        tags: '',
    });
    const history = useHistory();
    const { id } = useParams(); // Récupérer l'ID de l'article depuis l'URL

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`/api/articles/${id}`);
                const { title, description, image, tags } = response.data;
                setArticle({ title, description, image, tags: tags.join(', ') });
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'article:', error);
            }
        };
        fetchArticle();
    }, [id]);

    const handleChange = (e) => {
        setArticle({ ...article, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/articles/${id}`, {
                ...article,
                tags: article.tags.split(',').map(tag => tag.trim()),
            });
            history.push('/article'); // Redirige vers la liste des articles
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
        }
    };

    return (
        <div className="contact-p-container">
            <LeftNav />
            <div className="contact-page">
                <h2>Éditer l'Article</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Titre" value={article.title} onChange={handleChange} required />
                    <textarea name="description" placeholder="Description" value={article.description} onChange={handleChange} required></textarea>
                    <input type="text" name="image" placeholder="URL de l'image" value={article.image} onChange={handleChange} required />
                    <input type="text" name="tags" placeholder="Tags (séparés par des virgules)" value={article.tags} onChange={handleChange} required />
                    <button type="submit">Sauvegarder</button>
                </form>
            </div>
        </div>
    );
};

export default EditArticle;
