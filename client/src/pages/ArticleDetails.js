import { useState, useEffect } from 'react';
import axios from '../axios';
import { useParams } from 'react-router-dom';
import LeftNav from '../components/LeftNav';

const ArticleDetails = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`/api/articles/${id}`);
                setArticle(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'article:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) return <p>Chargement de l'article...</p>;
    if (!article) return <p>Article non trouvé.</p>;

    return (
        <div className="contact-p-container">
            <LeftNav />
            <div className="contact-page">
                <h2>{article.title}</h2>
                <img src={article.image} alt={article.title} style={{ width: '300px' }} />
                <p>Description: {article.description}</p>
                <p>Tags: {article.tags.join(', ')}</p>
            </div>
        </div>
    );
};

export default ArticleDetails;
