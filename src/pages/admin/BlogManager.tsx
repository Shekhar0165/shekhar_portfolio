import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, Check, ExternalLink, Upload, Image as ImageIcon } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import ReactQuill from 'react-quill-new';

interface BlogPostType {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    published: boolean;
    seoKeywords: string[];
    tags: string[];
    author: string;
    readingTime: string;
    metaDescription: string;
    createdAt: string;
}

interface BlogFormState {
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    published: boolean;
    seoKeywords: string;
    tags: string;
    author: string;
    readingTime: string;
    metaDescription: string;
}

const BlogManager = () => {
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const quillRef = useRef<ReactQuill>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<BlogFormState>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        published: true,
        seoKeywords: '',
        tags: '',
        author: 'Shekhar Kashyap',
        readingTime: '',
        metaDescription: ''
    });

    // Upload image to S3 via backend
    const uploadImageToS3 = async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await api.post('/upload/image', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.url;
    };

    // Custom ReactQuill image handler — opens file picker, uploads to S3, inserts inline
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.setAttribute('multiple', 'true');
        input.click();

        input.onchange = async () => {
            const files = input.files;
            if (!files) return;

            const quill = quillRef.current?.getEditor();
            if (!quill) return;

            setUploading(true);
            try {
                for (let i = 0; i < files.length; i++) {
                    const url = await uploadImageToS3(files[i]);
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', url);
                    quill.setSelection(range.index + 1, 0);
                }
            } catch (err) {
                console.error('Image upload failed:', err);
                alert('Failed to upload image');
            }
            setUploading(false);
        };
    }, []);

    // Quill modules with custom image handler
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image', 'video'],
                ['clean'],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                [{ 'code-block': true }]
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), [imageHandler]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/blog/admin/all');
            setPosts(res.data);
        } catch (error) {
            console.error('Failed to fetch posts', error);
            try {
                const res = await api.get('/blog');
                setPosts(res.data);
            } catch (fallbackError) {
                console.error(fallbackError);
            }
        }
    };

    // Cover image upload handler
    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImageToS3(file);
            setFormData((prev) => ({ ...prev, coverImage: url }));
        } catch (err) {
            console.error('Cover upload failed:', err);
            alert('Failed to upload cover image');
        }
        setUploading(false);
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            seoKeywords: formData.seoKeywords ? formData.seoKeywords.split(',').map(k => k.trim()) : [],
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
        };

        try {
            if (formData._id) {
                await api.patch(`/blog/${formData._id}`, payload);
            } else {
                await api.post('/blog', payload);
            }
            setIsEditing(false);
            fetchPosts();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save post');
        }
    };

    const handleEdit = (post: BlogPostType) => {
        setFormData({
            _id: post._id,
            title: post.title,
            slug: post.slug || '',
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage || '',
            published: post.published,
            seoKeywords: post.seoKeywords ? post.seoKeywords.join(', ') : '',
            tags: post.tags ? post.tags.join(', ') : '',
            author: post.author || 'Shekhar Kashyap',
            readingTime: post.readingTime || '',
            metaDescription: post.metaDescription || ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this specific blog post?')) {
            try {
                await api.delete(`/blog/${id}`);
                fetchPosts();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            coverImage: '',
            published: true,
            seoKeywords: '',
            tags: '',
            author: 'Shekhar Kashyap',
            readingTime: '',
            metaDescription: ''
        });
        setIsEditing(true);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Helmet>
                <title>Blog Manager | Admin</title>
            </Helmet>

            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Blog Publisher</h1>
                    <p className="text-muted-foreground mt-2">Write and manage SEO-optimized articles.</p>
                </div>
                <Button
                    onClick={resetForm}
                    className="bg-gradient-to-r from-neonCyan to-neonPurple hover:opacity-90 text-white border-0 py-6"
                >
                    <Plus size={20} className="mr-2" /> Write New Post
                </Button>
            </header>

            {/* Uploading overlay */}
            {uploading && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-8 py-6 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-3" />
                        <p className="text-slate-200 font-medium">Uploading to S3...</p>
                    </div>
                </div>
            )}

            {isEditing && (
                <div className="mb-10 p-6 bg-secondary/20 border border-border rounded-xl backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-heading font-bold text-foreground">
                            {formData._id ? 'Edit Post' : 'Create Post'}
                        </h2>
                    </div>

                    <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label>Title *</Label>
                                <Input
                                    required
                                    type="text"
                                    className="bg-background border-border"
                                    value={formData.title}
                                    onChange={e => {
                                        const title = e.target.value;
                                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                        setFormData({ ...formData, title, slug: formData._id ? formData.slug : slug });
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Custom URL Slug</Label>
                                <Input
                                    type="text"
                                    className="bg-background border-border"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="my-awesome-post"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Excerpt / Meta Description (SEO) *</Label>
                            <Textarea
                                required
                                rows={2}
                                className="bg-background border-border resize-none"
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="A short summary for search engines..."
                            />
                        </div>

                        {/* Cover Image — S3 Upload */}
                        <div className="flex flex-col gap-2">
                            <Label>Cover Image</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="text"
                                    className="bg-background border-border flex-1"
                                    value={formData.coverImage}
                                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                                    placeholder="URL or upload an image →"
                                />
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleCoverUpload}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => coverInputRef.current?.click()}
                                    className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 shrink-0"
                                >
                                    <Upload size={16} className="mr-2" /> Upload
                                </Button>
                            </div>
                            {formData.coverImage && (
                                <img
                                    src={formData.coverImage}
                                    alt="Cover preview"
                                    className="mt-2 rounded-lg max-h-48 object-cover border border-border"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label>SEO Keywords (Comma separated)</Label>
                                <Input
                                    type="text"
                                    className="bg-background border-border"
                                    value={formData.seoKeywords}
                                    onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })}
                                    placeholder="nestjs, react, tutorial"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Tags (Comma separated)</Label>
                                <Input
                                    type="text"
                                    className="bg-background border-border"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="Backend, DevOps, Docker"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label>Author Name</Label>
                                <Input
                                    type="text"
                                    className="bg-background border-border"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Reading Time (e.g., 5 min read)</Label>
                                <Input
                                    type="text"
                                    className="bg-background border-border"
                                    value={formData.readingTime}
                                    onChange={e => setFormData({ ...formData, readingTime: e.target.value })}
                                    placeholder="5 min read"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Custom Meta Description (for SEO)</Label>
                            <Input
                                type="text"
                                className="bg-background border-border"
                                value={formData.metaDescription}
                                onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                placeholder="If empty, excerpt will be used..."
                            />
                        </div>

                        {/* Rich Text Editor with S3 inline image upload */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between mb-2">
                                <Label>Article Content *</Label>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ImageIcon size={14} /> Click image icon in toolbar to upload from your computer
                                </span>
                            </div>
                            <div className="bg-background border border-border rounded-lg overflow-hidden text-foreground">
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    modules={modules}
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    className="h-[500px] mb-12"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.published}
                                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                                className="w-5 h-5 rounded border-border bg-background checked:bg-neonCyan focus:ring-neonCyan"
                            />
                            <Label htmlFor="published" className="mb-0 text-base font-medium text-foreground cursor-pointer">
                                Publish Immediately
                            </Label>
                        </div>

                        <div className="flex justify-end gap-4 mt-8 border-t border-border pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="border-border hover:bg-secondary h-12 px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-neonCyan to-neonPurple hover:opacity-90 text-white h-12 px-8 border-0"
                            >
                                <Check size={20} className="mr-2" /> {formData._id ? 'Update Document' : 'Publish Article'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-secondary/10 border border-border rounded-xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-secondary/30">
                            <th className="p-4 font-heading font-medium text-muted-foreground w-1/2">Post Details</th>
                            <th className="p-4 font-heading font-medium text-muted-foreground w-1/4">Status</th>
                            <th className="p-4 font-heading font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post._id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-foreground mb-1 text-lg">{post.title}</div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 rounded-full bg-border"></span>
                                        <span className="truncate max-w-[200px]">{post.slug}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {post.published ? (
                                        <span className="inline-flex py-1 px-3 rounded-full bg-neonCyan/10 text-neonCyan text-xs font-bold border border-neonCyan/20">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="inline-flex py-1 px-3 rounded-full bg-secondary text-muted-foreground text-xs font-bold border border-border">
                                            Draft
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        {post.published && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="border-blue-500 text-blue-500 hover:bg-blue-500/10 hidden md:flex"
                                            >
                                                <Link to={`/blog/${post.slug}`} target="_blank">
                                                    <ExternalLink size={16} />
                                                </Link>
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(post)}
                                            className="border-neonCyan text-neonCyan hover:bg-neonCyan/10"
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(post._id)}
                                            className="border-red-500 text-red-500 hover:bg-red-500/10"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-12 text-center text-muted-foreground">
                                    No blog posts found. Time to write something!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogManager;
