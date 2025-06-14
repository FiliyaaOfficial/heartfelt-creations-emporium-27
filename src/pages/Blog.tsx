
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  published_at: string;
  slug: string;
  reading_time: number;
  tags: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data: blogPosts, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching blog posts:', error);
          return;
        }

        if (blogPosts && blogPosts.length > 0) {
          // Set featured post to the first one
          setFeaturedPost(blogPosts[0]);
          
          // Set the rest as regular posts
          setPosts(blogPosts.slice(1));
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-heartfelt-burgundy mr-2" />
        <span className="text-lg">Loading blog posts...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-heartfelt-cream/10">
      {/* Blog Header */}
      <div className="bg-heartfelt-burgundy text-white">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="mr-2" />
            <h2 className="text-sm font-medium uppercase tracking-wider">Our Blog</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-center mb-4">
            Stories & Inspiration
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-center text-lg">
            Discover the stories behind our handcrafted creations, get inspired, and learn about the art of meaningful gifting.
          </p>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-xl overflow-hidden shadow-xl bg-white">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto bg-gray-200 relative overflow-hidden">
                <img 
                  src={featuredPost.cover_image} 
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center text-heartfelt-burgundy mb-3">
                  <span className="px-3 py-1 bg-heartfelt-burgundy/10 rounded-full text-xs font-medium">
                    Featured Post
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-medium mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <User size={14} className="mr-1" />
                  <span className="mr-3">{featuredPost.author}</span>
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(featuredPost.published_at)}</span>
                </div>
                <Button 
                  asChild 
                  className="bg-heartfelt-burgundy hover:bg-heartfelt-dark w-fit"
                >
                  <Link to={`/blog/${featuredPost.slug}`}>
                    Read Full Article <ArrowRight size={16} className="ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Posts */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif font-medium mb-8">Recent Articles</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No recent articles available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow bg-white border-none shadow">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={post.cover_image} 
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-medium text-xl mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar size={12} className="mr-1" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <Button 
                      variant="link" 
                      asChild 
                      className="p-0 h-auto text-heartfelt-burgundy hover:text-heartfelt-dark"
                    >
                      <Link to={`/blog/${post.slug}`} className="flex items-center">
                        Read more <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
