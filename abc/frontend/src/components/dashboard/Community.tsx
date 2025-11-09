import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Share2, Send, Loader2, AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["Case Update", "Best Practices", "Request Support", "Innovation", "Question"];
const API_BASE_URL = "http://localhost:8000";

interface CommunityPost {
  id: number;
  user_id: number;
  author_name: string;
  district: string;
  category: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  liked?: boolean;
  comments?: Comment[];
}

interface Comment {
  id: number;
  user_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Case Update");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState<Record<number, string>>({});
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  // Mock user - in a real app, this would come from context/localStorage
  const currentUser = {
    id: 1,
    name: "Inspector Rajesh Kumar",
    district: "Bhubaneswar",
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/community/posts?limit=20`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      
      // Check which posts are liked by current user
      const postsWithLikeStatus = await Promise.all(
        data.data.map(async (post: CommunityPost) => {
          const likeResponse = await fetch(
            `${API_BASE_URL}/community/posts/${post.id}/liked?user_id=${currentUser.id}`
          );
          const likeData = await likeResponse.json();
          return { ...post, liked: likeData.liked };
        })
      );
      
      setPosts(postsWithLikeStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      setError("Please write something before posting");
      return;
    }

    try {
      setIsCreatingPost(true);
      const response = await fetch(`${API_BASE_URL}/community/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          author_name: currentUser.name,
          district: currentUser.district,
          category: selectedCategory,
          content: newPostContent,
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");
      
      setNewPostContent("");
      setSelectedCategory("Case Update");
      setIsPostDialogOpen(false);
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
      console.error("Error creating post:", err);
    } finally {
      setIsCreatingPost(false);
    }
  };

  // Toggle like
  const handleLike = async (postId: number, isLiked: boolean) => {
    try {
      const endpoint = isLiked ? "unlike" : "like";
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}/${endpoint}?user_id=${currentUser.id}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to update like");
      
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update like");
      console.error("Error toggling like:", err);
    }
  };

  // Fetch comments for a post
  const fetchPostComments = async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      
      // Update the post with comments
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, comments: data.data } : p
        )
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Add comment
  const handleAddComment = async (postId: number) => {
    const content = commentContent[postId]?.trim();
    if (!content) return;

    try {
      const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          author_name: currentUser.name,
          content: content,
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");
      
      setCommentContent({ ...commentContent, [postId]: "" });
      
      // Update comments count
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
        )
      );
      
      // Fetch updated comments
      await fetchPostComments(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
      console.error("Error adding comment:", err);
    }
  };

  // Handle expand/collapse comments
  const handleToggleComments = async (postId: number) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      // Fetch comments when expanding
      await fetchPostComments(postId);
    }
  };

  // Share post
  const handleShare = (post: CommunityPost) => {
    const shareText = `Check out this post from ${post.author_name} in Copsight: "${post.content.substring(
      0,
      100
    )}..." - Category: ${post.category}`;

    if (navigator.share) {
      navigator.share({
        title: "Copsight Community Post",
        text: shareText,
      }).catch((err) => console.log("Error sharing:", err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          setError("Post text copied to clipboard!");
          setTimeout(() => setError(null), 2000);
        })
        .catch(() => {
          setError("Unable to share post");
        });
    }
  };

  // Delete post
  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}?user_id=${currentUser.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete post");
      
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
      console.error("Error deleting post:", err);
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Open Community</h1>
        <p className="text-muted-foreground">Connect and collaborate with fellow officers</p>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Post Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogTrigger asChild>
          <Card className="glass-card border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Share Case Update
              </CardTitle>
              <CardDescription>Post updates, ask questions, or share insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[100px] bg-card/50 border border-border rounded-md flex items-center justify-center text-muted-foreground">
                Click to compose a post...
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription>Share your insights, ask questions, or update the community</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">What's on your mind?</label>
              <Textarea
                placeholder="Share your case update, best practices, or ask for assistance..."
                className="min-h-[150px] bg-card/50 border-border"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">{newPostContent.length} characters</p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="gap-2 neon-glow"
                onClick={handleCreatePost}
                disabled={isCreatingPost || !newPostContent.trim()}
              >
                {isCreatingPost ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Post Update
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Community Feed */}
      {loading ? (
        <Card className="glass-card">
          <CardContent className="pt-6 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading community posts...</span>
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No posts yet. Be the first to share!</p>
            <Button className="gap-2 neon-glow" onClick={() => setIsPostDialogOpen(true)}>
              <Send className="h-4 w-4" />
              Create Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="glass-card hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {post.author_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{post.author_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {post.district} • {formatTime(post.created_at)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    {post.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{post.content}</p>

                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${post.liked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                    onClick={() => handleLike(post.id, post.liked || false)}
                  >
                    <ThumbsUp className="h-4 w-4" fill={post.liked ? "currentColor" : "none"} />
                    <span>{post.likes_count}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-primary"
                    onClick={() =>
                      handleToggleComments(post.id)
                    }
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments_count} Comments</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-primary"
                    onClick={() => handleShare(post)}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  {post.user_id === currentUser.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 ml-auto text-destructive hover:text-destructive"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Comments Section */}
                {expandedPostId === post.id && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 border border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                  {comment.author_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{comment.author_name}</p>
                                <p className="text-xs text-muted-foreground">{formatTime(comment.created_at)}</p>
                              </div>
                            </div>
                            <p className="text-foreground mt-1 ml-8">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No comments yet</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Textarea
                        placeholder="Write a comment..."
                        className="min-h-[40px] bg-card/50 border-border text-sm"
                        value={commentContent[post.id] || ""}
                        onChange={(e) =>
                          setCommentContent({ ...commentContent, [post.id]: e.target.value })
                        }
                      />
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentContent[post.id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
