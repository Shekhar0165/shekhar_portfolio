import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import api from '../services/api';


interface BlogPostType {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    createdAt: string;
    seoKeywords: string[];
}

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/blog/${slug}`);
                setPost(response.data);
            } catch (error) {
                console.error('Failed to fetch blog post', error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonCyan"></div>
            </div>
        );
    }

    if (!post) {
        return <div className="text-center py-20 text-2xl font-bold">Post Not Found</div>;
    }

    return (
        <>
            <Helmet>
                <title>{post.title} | Shekhar Kashyap</title>
                <meta name="description" content={post.excerpt} />
                <meta name="keywords" content={post.seoKeywords?.join(', ')} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                {post.coverImage && <meta property="og:image" content={post.coverImage} />}
            </Helmet>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 pt-8">
                {/* Main Content (70% width on desktop) */}
                <main className="w-full lg:w-8/12">
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {post.coverImage && (
                            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 border border-border">
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <header className="mb-10">
                            <div className="flex items-center gap-2 text-neonCyan font-medium mb-4">
                                <Calendar size={18} />
                                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                                {post.title}
                            </h1>
                        </header>

                        {/* Rich Text React-Quill Output */}
                        <div
                            className="prose prose-invert prose-lg max-w-none prose-a:text-neonCyan prose-img:rounded-xl text-foreground"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </motion.article>
                </main>

                {/* AdSense Sidebar (30% width on desktop, sticky) */}
                <aside className="w-full lg:w-4/12">
                    <div className="sticky top-24 flex flex-col gap-8">
                        {/* Author Card */}
                        {/* 
                        <Card className="text-center p-6 bg-background/50 backdrop-blur-sm">
                            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-r from-neonCyan to-neonPurple p-1 mb-4">
                                <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center font-bold text-2xl text-foreground">
                                    SK
                                </div>
                            </div>
                            <h3 className="font-heading font-bold text-xl mb-2">Shekhar Kashyap</h3>
                            <p className="text-sm text-muted-foreground mb-4">Full-Stack Engineer building scalable systems and fast applications.</p>
                            <Button asChild className="w-full bg-gradient-to-r from-neonCyan to-neonPurple border-0 text-white">
                                <Link to="/contact">Hire Me</Link>
                            </Button>
                        </Card> 
                        */}

                        {/* AdSense Placement Box */}
                        {/* 
                        <div className="border border-border bg-secondary/20 rounded-xl p-4 min-h-[600px] flex items-center justify-center relative overflow-hidden group">
                            <div className="text-center opacity-30 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Advertisement</span>
                                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                                    AdSense Vertical Banner Unit will display here.
                                </p>
                            </div>
                            <div className="absolute inset-0 border-2 border-dashed border-neonCyan/20 m-4 rounded pointer-events-none" />
                        </div>
                        */}
                    </div>
                </aside>
            </div>
        </>
    );
};

export default BlogPost;
