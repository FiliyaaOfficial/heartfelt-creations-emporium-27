
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
  created_at: string;
  slug: string;
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
        // For demo purposes, creating mock blog data
        const mockPosts = [
          {
            id: '1',
            title: 'Handcrafting with Love: The Art of Personalized Gifts',
            excerpt: 'Discover the joy and meaning behind handcrafted personalized gifts and why they make the perfect present for your loved ones.',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <h2>The Personal Touch Makes All the Difference</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
            <h2>Creating Lasting Memories</h2>
            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>`,
            cover_image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
            author: 'Sarah Johnson',
            created_at: '2025-03-15T10:30:00Z',
            slug: 'handcrafting-with-love'
          },
          {
            id: '2',
            title: 'The Perfect Gift Guide for Every Occasion',
            excerpt: 'From birthdays to anniversaries, find the ideal handmade gift for any special moment in your loved ones' lives.',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <h2>Birthdays: Celebrating Another Year</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            <h2>Anniversaries: Honoring Your Journey Together</h2>
            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p>`,
            cover_image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1200&auto=format&fit=crop',
            author: 'Michael Chen',
            created_at: '2025-03-10T14:45:00Z',
            slug: 'gift-guide-for-every-occasion'
          },
          {
            id: '3',
            title: 'The Sustainable Gift Revolution: Eco-Friendly Choices',
            excerpt: 'How our handcrafted gifts are not only beautiful but also environmentally conscious and sustainable.',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <h2>Why Sustainability Matters in Gift-Giving</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <h2>Our Eco-Friendly Materials</h2>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>`,
            cover_image: 'https://images.unsplash.com/photo-1610114113404-0d9769eb5b82?q=80&w=1200&auto=format&fit=crop',
            author: 'Emma Rodriguez',
            created_at: '2025-03-05T09:15:00Z',
            slug: 'sustainable-gift-revolution'
          },
          {
            id: '4',
            title: 'Behind the Scenes: Meet Our Artisan Craftspeople',
            excerpt: 'Get to know the talented individuals who pour their heart and soul into creating our beautiful handcrafted items.',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <h2>The Masters Behind Our Creations</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>`,
            cover_image: 'https://images.unsplash.com/photo-1507236827745-1a76294d9ab2?q=80&w=1200&auto=format&fit=crop',
            author: 'David Wilson',
            created_at: '2025-02-28T16:20:00Z',
            slug: 'meet-our-artisan-craftspeople'
          },
          {
            id: '5',
            title: 'Customer Stories: Memorable Gifts That Changed Lives',
            excerpt: 'Heartwarming stories from our customers about how our personalized gifts created unforgettable moments.',
            content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <h2>A Birthday Surprise That Brought Tears of Joy</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <h2>A Memorial Gift That Preserved Precious Memories</h2>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>`,
            cover_image: 'https://images.unsplash.com/photo-1559452214-f4901ae5a753?q=80&w=1200&auto=format&fit=crop',
            author: 'Jessica Taylor',
            created_at: '2025-02-20T11:10:00Z',
            slug: 'customer-stories-memorable-gifts'
          }
        ];
        
        // Find the post with matching slug
        const foundPost = mockPosts.find(p => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          
          // Set related posts (all posts except the current one)
          setRelatedPosts(mockPosts.filter(p => p.id !== foundPost.id).slice(0, 3));
        } else {
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
    
    fetchPost();
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
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full h-full object-cover opacity-20"
          />
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
              <span>{formatDate(post.created_at)}</span>
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
                      <img 
                        src={relatedPost.cover_image} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium group-hover:text-heartfelt-burgundy transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(relatedPost.created_at)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
