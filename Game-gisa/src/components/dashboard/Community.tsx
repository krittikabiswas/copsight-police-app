import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Share2, Send } from "lucide-react";

const communityPosts = [
  {
    id: 1,
    author: "Inspector Rajesh Kumar",
    district: "Bhubaneswar",
    time: "2 hours ago",
    content: "Successfully resolved a major NDPS case involving interstate drug trafficking. Looking for insights on improving evidence collection techniques.",
    likes: 24,
    comments: 8,
    category: "Case Update",
  },
  {
    id: 2,
    author: "SI Priya Sharma",
    district: "Cuttack",
    time: "5 hours ago",
    content: "Conducted a workshop on community policing. Sharing best practices that led to 40% increase in public cooperation.",
    likes: 31,
    comments: 12,
    category: "Best Practices",
  },
  {
    id: 3,
    author: "Inspector Anil Patel",
    district: "Puri",
    time: "1 day ago",
    content: "Need assistance with a missing persons case. Subject was last seen near coastal area. Any officers with similar experience?",
    likes: 18,
    comments: 15,
    category: "Request Support",
  },
  {
    id: 4,
    author: "ASI Meera Das",
    district: "Balasore",
    time: "2 days ago",
    content: "Implemented new digital evidence tracking system. Results are promising - 30% faster case resolution. Happy to share the process.",
    likes: 42,
    comments: 19,
    category: "Innovation",
  },
];

export const Community = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Open Community</h1>
        <p className="text-muted-foreground">Connect and collaborate with fellow officers</p>
      </div>

      {/* Create Post */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Share Case Update
          </CardTitle>
          <CardDescription>Post updates, ask questions, or share insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share case updates, best practices, or seek assistance..."
              className="min-h-[100px] bg-card/50 border-border"
            />
            <div className="flex gap-3">
              <Button className="gap-2 neon-glow">
                <Send className="h-4 w-4" />
                Post Update
              </Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Feed */}
      <div className="space-y-4">
        {communityPosts.map((post) => (
          <Card key={post.id} className="glass-card hover:border-primary/30 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{post.author}</h4>
                    <p className="text-sm text-muted-foreground">
                      {post.district} • {post.time}
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
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments} Comments</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
