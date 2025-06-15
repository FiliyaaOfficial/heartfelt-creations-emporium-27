
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Share2, Bookmark, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching blog post with slug:', slug);
        
        // Fetch the specific blog post by slug
        const { data: blogPost, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();
        
        console.log('Supabase blog post response:', { blogPost, fetchError });
        
        if (fetchError) {
          console.error('Error fetching blog post:', fetchError);
          toast({
            title: "Error loading blog post",
            description: "Please try again later",
            variant: "destructive",
          });
          return;
        }

        if (blogPost) {
          setPost(blogPost);
          
          // Fetch related posts (other published posts, excluding current one)
          const { data: relatedPostsData, error: relatedError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('is_published', true)
            .neq('id', blogPost.id)
            .order('published_at', { ascending: false })
            .limit(3);
          
          if (relatedError) {
            console.error('Error fetching related posts:', relatedError);
          } else {
            setRelatedPosts(relatedPostsData || []);
          }
        } else {
          console.log('Blog post not found for slug:', slug);
          toast({
            title: "Blog post not found",
            description: "The blog post you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Error loading blog post",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug, toast]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-heartfelt-burgundy mr-2" />
        <span className="text-lg">Loading blog post...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl mb-4">Blog post not found</h2>
        <Button asChild className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-heartfelt-cream/5">
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 bg-gradient-to-br from-heartfelt-burgundy to-heartfelt-dark overflow-hidden">
        <div className="absolute inset-0">
          {post.cover_image && (
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="w-full h-full object-cover opacity-20"
            />
          )}
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="mb-6 w-fit bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
          >
            <Link to="/blog" className="flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Blog
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white font-semibold max-w-3xl mb-6">
            {post.title}
          </h1>
          <div className="flex items-center text-white/80">
            <div className="flex items-center mr-6">
              <User size={16} className="mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(post.published_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Sharing and Bookmarking */}
              <div className="flex justify-between items-center border-t border-gray-100 mt-10 pt-6">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Share this article:</span>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Bookmark size={16} className="mr-1" />
                  Save for later
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Bio */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="font-medium text-lg mb-4">About the Author</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-heartfelt-burgundy/20 rounded-full flex items-center justify-center text-heartfelt-burgundy mr-3">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-medium">{post.author}</h4>
                  <p className="text-sm text-muted-foreground">Content Writer</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                A passionate writer with expertise in handcrafted gifts and personalized present ideas. Loves to share unique stories and inspiration.
              </p>
            </div>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.id} 
                      to={`/blog/${relatedPost.slug}`}
                      className="flex items-start group"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        {relatedPost.cover_image ? (
                          <img 
                            src={relatedPost.cover_image} 
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <BookOpen size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium group-hover:text-heartfelt-burgundy transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(relatedPost.published_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    asChild 
                    className="w-full justify-center hover:bg-heartfelt-burgundy hover:text-white"
                  >
                    <Link to="/blog">View All Articles</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
