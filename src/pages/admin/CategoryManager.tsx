import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface CategoryType {
    _id: string;
    name: string;
    slug: string;
    order: number;
}

const CategoryManager = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [order, setOrder] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
        setName(value);
        setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    };

    const handleCreate = async () => {
        if (!name.trim() || !slug.trim()) return;
        setLoading(true);
        try {
            await api.post('/categories', { name: name.trim(), slug: slug.trim(), order });
            setName('');
            setSlug('');
            setOrder(0);
            fetchCategories();
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Failed to create category');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    };

    return (
        <div>
            <Helmet>
                <title>Blog Categories | Admin</title>
            </Helmet>

            <h2 className="text-2xl font-bold mb-6">Blog Categories</h2>

            {/* Create form */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus size={18} /> Add Category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="mb-1.5 block">Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g. DevOps"
                        />
                    </div>
                    <div>
                        <Label className="mb-1.5 block">Slug</Label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. devops"
                        />
                    </div>
                    <div>
                        <Label className="mb-1.5 block">Order</Label>
                        <Input
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(Number(e.target.value))}
                        />
                    </div>
                </div>
                <Button
                    onClick={handleCreate}
                    disabled={loading || !name.trim()}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                    {loading ? 'Creating...' : 'Add Category'}
                </Button>
            </div>

            {/* List */}
            <div className="space-y-2">
                {categories.length === 0 ? (
                    <p className="text-zinc-400 text-center py-8">No categories yet. Add one above!</p>
                ) : (
                    categories.map((cat) => (
                        <div
                            key={cat._id}
                            className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-3"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-zinc-500 font-mono w-6 text-right">#{cat.order}</span>
                                <span className="font-medium">{cat.name}</span>
                                <span className="text-xs text-zinc-500 font-mono">/{cat.slug}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(cat._id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
