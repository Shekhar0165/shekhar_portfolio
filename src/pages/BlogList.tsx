import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import api from '../services/api';

export interface BlogType {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    coverImage?: string;
    createdAt: string;
    seoKeywords: string[];
}

const BlogList = () => {
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get('/blog?published=true');
                setBlogs(response.data);
            } catch (error) {
                console.error('Failed to fetch blogs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <>
            <Helmet>
                <title>Blog - Shekhar Kashyap</title>
                <meta name="description" content="Technical articles and tutorials on NestJS, React Native, and Full-Stack Development by Shekhar Kashyap." />
            </Helmet>

            <div className="max-w-4xl mx-auto pt-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">Insights</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Deep dives into software architecture, scalable backends, and frontend performance.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neonCyan"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {blogs.map((blog, index) => (
                            <motion.article
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-background/50 backdrop-blur-sm border border-border rounded-xl flex flex-col md:flex-row gap-6 p-6 md:p-8 group hover:border-neonCyan/30 transition-colors"
                            >
                                {blog.coverImage && (
                                    <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                                        <Calendar size={16} />
                                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold text-foreground group-hover:text-neonCyan transition-colors mb-3">
                                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                                    </h2>
                                    <p className="text-muted-foreground flex-grow mb-6">{blog.excerpt}</p>

                                    <Link to={`/blog/${blog.slug}`} className="mt-auto inline-flex items-center gap-2 font-medium text-neonCyan hover:text-neonPurple transition-colors">
                                        Read Article <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}

                        {blogs.length === 0 && (
                            <div className="text-center text-muted-foreground py-20">
                                No articles published yet. Stay tuned!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default BlogList;
