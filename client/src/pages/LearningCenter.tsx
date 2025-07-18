import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/components/UserAuthProvider";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Award, 
  Users, 
  CheckCircle,
  Search,
  Filter,
  Download,
  Video,
  FileText,
  Headphones,
  Calendar,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  students: number;
  progress: number;
  type: 'video' | 'article' | 'interactive' | 'webinar';
  instructor: string;
  completionReward: number;
  skills: string[];
  isNew: boolean;
  isFeatured: boolean;
}

interface LearningStats {
  coursesCompleted: number;
  totalHours: number;
  skillsLearned: number;
  certificatesEarned: number;
  currentStreak: number;
  rank: string;
}

export default function LearningCenter() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const stats: LearningStats = {
    coursesCompleted: 12,
    totalHours: 48,
    skillsLearned: 25,
    certificatesEarned: 8,
    currentStreak: 7,
    rank: "Expert Level"
  };

  const courses: Course[] = [
    {
      id: "1",
      title: "Advanced Network Security Fundamentals",
      description: "Master the latest network security protocols, threat detection, and incident response techniques.",
      category: "Cybersecurity",
      level: "advanced",
      duration: "6 hours",
      rating: 4.9,
      students: 1247,
      progress: 75,
      type: "video",
      instructor: "Dr. Sarah Chen",
      completionReward: 50,
      skills: ["Network Security", "Threat Detection", "Incident Response"],
      isNew: true,
      isFeatured: true
    },
    {
      id: "2",
      title: "Modern Web Development with React",
      description: "Build responsive web applications using React, TypeScript, and modern development practices.",
      category: "Web Development",
      level: "intermediate",
      duration: "8 hours",
      rating: 4.8,
      students: 2156,
      progress: 30,
      type: "interactive",
      instructor: "Mike Johnson",
      completionReward: 60,
      skills: ["React", "TypeScript", "Modern Web Dev"],
      isNew: false,
      isFeatured: true
    },
    {
      id: "3",
      title: "Database Optimization Techniques",
      description: "Learn advanced SQL optimization, indexing strategies, and performance tuning for large databases.",
      category: "Database Management",
      level: "advanced",
      duration: "4 hours",
      rating: 4.7,
      students: 892,
      progress: 0,
      type: "video",
      instructor: "Alex Rodriguez",
      completionReward: 45,
      skills: ["SQL Optimization", "Database Tuning", "Performance"],
      isNew: true,
      isFeatured: false
    },
    {
      id: "4",
      title: "Customer Service Excellence",
      description: "Develop professional communication skills and conflict resolution strategies for technical support.",
      category: "Professional Skills",
      level: "beginner",
      duration: "3 hours",
      rating: 4.6,
      students: 1823,
      progress: 100,
      type: "webinar",
      instructor: "Emma Wilson",
      completionReward: 30,
      skills: ["Communication", "Conflict Resolution", "Customer Service"],
      isNew: false,
      isFeatured: false
    },
    {
      id: "5",
      title: "Mobile Device Troubleshooting",
      description: "Comprehensive guide to diagnosing and fixing common mobile device issues across all platforms.",
      category: "Mobile Technology",
      level: "intermediate",
      duration: "5 hours",
      rating: 4.8,
      students: 1456,
      progress: 60,
      type: "interactive",
      instructor: "James Park",
      completionReward: 40,
      skills: ["Mobile Repair", "iOS", "Android", "Troubleshooting"],
      isNew: false,
      isFeatured: true
    },
    {
      id: "6",
      title: "Cloud Computing Essentials",
      description: "Introduction to cloud platforms, deployment strategies, and infrastructure management.",
      category: "Cloud Computing",
      level: "beginner",
      duration: "4 hours",
      rating: 4.5,
      students: 2341,
      progress: 0,
      type: "article",
      instructor: "Lisa Thompson",
      completionReward: 35,
      skills: ["AWS", "Azure", "Cloud Deployment", "DevOps"],
      isNew: true,
      isFeatured: false
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'interactive': return <Zap className="h-4 w-4" />;
      case 'webinar': return <Headphones className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleStartCourse = (courseId: string) => {
    console.log("Starting course:", courseId);
  };

  const handleContinueCourse = (courseId: string) => {
    console.log("Continuing course:", courseId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Center</h1>
          <p className="text-gray-600">Expand your skills and advance your career with our comprehensive training programs</p>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.coursesCompleted}</div>
                <div className="text-sm text-gray-600">Courses Completed</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalHours}</div>
                <div className="text-sm text-gray-600">Hours Learned</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.skillsLearned}</div>
                <div className="text-sm text-gray-600">Skills Mastered</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.certificatesEarned}</div>
                <div className="text-sm text-gray-600">Certificates</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{stats.rank}</div>
                <div className="text-sm text-gray-600">Current Rank</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Database Management">Database Management</option>
                      <option value="Professional Skills">Professional Skills</option>
                      <option value="Mobile Technology">Mobile Technology</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(course.type)}
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        {course.isNew && (
                          <Badge className="bg-blue-100 text-blue-800">New</Badge>
                        )}
                        {course.isFeatured && (
                          <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span>${course.completionReward}</span>
                      </div>
                    </div>
                    
                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {course.progress === 0 ? (
                        <Button 
                          onClick={() => handleStartCourse(course.id)}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Course
                        </Button>
                      ) : course.progress === 100 ? (
                        <Button variant="outline" className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleContinueCourse(course.id)}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(course => course.progress > 0 && course.progress < 100).map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-gray-600">by {course.instructor}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button 
                      onClick={() => handleContinueCourse(course.id)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(course => course.progress === 100).map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-gray-600">by {course.instructor}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      <span>Earned ${course.completionReward}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Quick Learner</h3>
                  <p className="text-sm text-gray-600 mb-4">Complete 5 courses in one month</p>
                  <Badge className="bg-yellow-100 text-yellow-800">Earned</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Skill Master</h3>
                  <p className="text-sm text-gray-600 mb-4">Master 20 different skills</p>
                  <Badge className="bg-green-100 text-green-800">Earned</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Consistent Learner</h3>
                  <p className="text-sm text-gray-600 mb-4">Maintain 7-day learning streak</p>
                  <Badge className="bg-blue-100 text-blue-800">Earned</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}