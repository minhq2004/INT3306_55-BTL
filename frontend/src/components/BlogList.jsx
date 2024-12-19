import { useState } from "react";
import { Card, CardBody, Button, Chip, Divider } from "@nextui-org/react";
import { ChevronLeft, Clock, User, Calendar } from "lucide-react";

const BlogList = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with React",
      excerpt:
        "Learn the basics of React and start building modern web applications",
      content:
        "React is a popular JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most widely used frontend technologies. In this post, we'll cover the core concepts of React including components, props, and state management...",
      author: "John Doe",
      date: "2024-12-09",
      readTime: "5 min",
      category: "Development",
    },
    {
      id: 2,
      title: "The Future of AI in Web Development",
      excerpt: "Exploring how AI is transforming the way we build websites",
      content:
        "Artificial Intelligence is revolutionizing web development with tools that can generate code, optimize performance, and create unique user experiences...",
      author: "Sarah Chen",
      date: "2024-12-08",
      readTime: "8 min",
      category: "AI",
    },
    {
      id: 3,
      title: "Advanced CSS Grid Techniques",
      excerpt: "Master modern CSS Grid layouts with these pro tips",
      content:
        "CSS Grid has transformed how we approach web layouts. In this deep dive, we'll explore advanced techniques for creating complex, responsive layouts...",
      author: "Maria Garcia",
      date: "2024-12-07",
      readTime: "10 min",
      category: "Design",
    },
    {
      id: 4,
      title: "Web3 Development Guide",
      excerpt: "Understanding blockchain and decentralized applications",
      content:
        "Web3 represents the next evolution of the internet. Learn about blockchain technology, smart contracts, and building decentralized applications...",
      author: "Alex Johnson",
      date: "2024-12-06",
      readTime: "15 min",
      category: "Blockchain",
    },
    {
      id: 5,
      title: "Mobile-First Design Principles",
      excerpt: "Essential strategies for modern responsive design",
      content:
        "Mobile-first design is more important than ever. Discover key principles and practical techniques for creating exceptional mobile experiences...",
      author: "David Kim",
      date: "2024-12-05",
      readTime: "7 min",
      category: "Design",
    },
    {
      id: 6,
      title: "TypeScript Best Practices",
      excerpt: "Write better, type-safe code with TypeScript",
      content:
        "TypeScript enhances JavaScript with static types. Learn best practices for writing maintainable, scalable TypeScript code...",
      author: "Emma Wilson",
      date: "2024-12-04",
      readTime: "12 min",
      category: "Development",
    },
    {
      id: 7,
      title: "Cloud Architecture Patterns",
      excerpt: "Design scalable and resilient cloud applications",
      content:
        "Explore common cloud architecture patterns and learn how to build applications that scale efficiently in the cloud...",
      author: "Michael Brown",
      date: "2024-12-03",
      readTime: "20 min",
      category: "Cloud",
    },
    {
      id: 8,
      title: "UX Research Methods",
      excerpt: "Essential techniques for understanding your users",
      content:
        "Effective UX research is crucial for product success. Learn about different research methods and when to use them...",
      author: "Lisa Anderson",
      date: "2024-12-02",
      readTime: "9 min",
      category: "UX",
    },
  ];

  const DetailView = ({ post, onBack }) => (
    <Card className="bg-white shadow-lg">
      <CardBody className="p-6">
        <Button
          variant="light"
          onClick={onBack}
          className="mb-4 text-blue-600"
          startContent={<ChevronLeft size={16} />}
        >
          Back to List
        </Button>

        <div className="space-y-6">
          <Chip color="primary" variant="flat" className="text-sm">
            {post.category}
          </Chip>
          <h1 className="text-3xl font-bold text-blue-900">{post.title}</h1>

          <div className="flex gap-6 text-blue-600">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="text-sm">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="text-sm">{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="text-sm">{post.readTime}</span>
            </div>
          </div>

          <Divider />
          <p className="text-gray-600 leading-relaxed">{post.content}</p>
        </div>
      </CardBody>
    </Card>
  );

  const ListView = ({ posts, onSelect }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-blue-900">Latest Blog Posts</h2>
        <Chip variant="flat" className="text-blue-600">
          {posts.length} Articles
        </Chip>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            isPressable
            onPress={() => onSelect(post)}
            className="border-l-4 border-l-blue-500 hover:scale-102 transition-transform"
          >
            <CardBody className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-blue-900">
                  {post.title}
                </h3>
                <Chip color="primary" variant="flat" size="sm">
                  {post.category}
                </Chip>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

              <div className="flex gap-4 text-blue-600 text-sm">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-blue-50 min-h-screen">
      {selectedPost ? (
        <DetailView post={selectedPost} onBack={() => setSelectedPost(null)} />
      ) : (
        <ListView posts={blogPosts} onSelect={setSelectedPost} />
      )}
    </div>
  );
};

export default BlogList;
