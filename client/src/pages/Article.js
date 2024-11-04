import { useState, useEffect } from 'react';
import axios from '../axios';
import LeftNav from '../components/LeftNav';
import { Link } from 'react-router-dom'; // Assurez-vous d'avoir installé react-router-dom

const Article = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        try {
            const response = await axios.get('/api/articles');
            setArticles(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteArticle = async (id) => {
        try {
            await axios.delete(`/api/articles/${id}`);
            fetchArticles(); // Recharger les articles après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article:', error);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div className="contact-p-container">
            <LeftNav />
            <div className="contact-page">
                <Link to="/add-article" className="btn">Ajouter un Article</Link>
                {loading ? (
                    <p>Chargement des articles...</p>
                ) : (
                    <div>
                        {articles.length > 0 ? (
                            <ul>
                                {articles.map(article => (
                                    <li key={article._id}>
                                        <h3>{article.title}</h3>
                                        <p>{article.description}</p>
                                        <p>Tags: {article.tags.join(', ')}</p>
                                        <img src={article.image} alt={article.title} style={{ width: '100px' }} />
                                        <Link to={`/edit-article/${article._id}`} className="btn">Éditer</Link>
                                        <button onClick={() => deleteArticle(article._id)} className="btn">Supprimer</button>
                                        <Link to={`/article/${article._id}`} className="btn">Détails</Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aucun article disponible ...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Article;
