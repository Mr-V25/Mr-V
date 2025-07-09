from models import Course, Lesson, Resource, UserProgress
from datetime import datetime
from typing import Dict, List, Optional

class DataStore:
    def __init__(self):
        self.courses: Dict[str, Course] = {}
        self.resources: Dict[str, Resource] = {}
        self.user_progress: Dict[str, UserProgress] = {}
        self._initialize_data()
    
    def _initialize_data(self):
        # Initialize sample courses
        self._create_sample_courses()
        self._create_sample_resources()
    
    def _create_sample_courses(self):
        # Mathematics Courses
        math_basic = Course(
            id="math-001",
            title="Basic Algebra",
            description="Learn the fundamentals of algebra including variables, equations, and basic operations.",
            instructor="Dr. Sarah Johnson",
            subject="Mathematics",
            difficulty="Beginner",
            duration="4 weeks",
            lessons=[
                Lesson("lesson-1", "Introduction to Variables", "Understanding what variables are and how they work in mathematical expressions.", "15 min", 1),
                Lesson("lesson-2", "Solving Linear Equations", "Step-by-step approach to solving linear equations.", "20 min", 2),
                Lesson("lesson-3", "Working with Inequalities", "Learn how to solve and graph inequalities.", "18 min", 3),
                Lesson("lesson-4", "Factoring Basics", "Introduction to factoring algebraic expressions.", "25 min", 4)
            ],
            tags=["algebra", "mathematics", "beginner"]
        )
        
        math_advanced = Course(
            id="math-002",
            title="Calculus I",
            description="Introduction to differential and integral calculus with real-world applications.",
            instructor="Prof. Michael Chen",
            subject="Mathematics",
            difficulty="Advanced",
            duration="12 weeks",
            lessons=[
                Lesson("lesson-5", "Limits and Continuity", "Understanding the concept of limits and continuous functions.", "30 min", 1),
                Lesson("lesson-6", "Derivatives", "Introduction to derivatives and differentiation rules.", "35 min", 2),
                Lesson("lesson-7", "Applications of Derivatives", "Using derivatives to solve optimization problems.", "40 min", 3),
                Lesson("lesson-8", "Integration", "Understanding integrals and the fundamental theorem of calculus.", "45 min", 4)
            ],
            tags=["calculus", "mathematics", "advanced"]
        )
        
        # Science Courses
        physics_basic = Course(
            id="physics-001",
            title="Introduction to Physics",
            description="Explore the fundamental concepts of physics including motion, forces, and energy.",
            instructor="Dr. Emily Rodriguez",
            subject="Science",
            difficulty="Beginner",
            duration="8 weeks",
            lessons=[
                Lesson("lesson-9", "Motion and Velocity", "Understanding how objects move and the concept of velocity.", "22 min", 1),
                Lesson("lesson-10", "Forces and Newton's Laws", "Learn about forces and Newton's three laws of motion.", "28 min", 2),
                Lesson("lesson-11", "Energy and Work", "Exploring different forms of energy and how work is done.", "25 min", 3),
                Lesson("lesson-12", "Waves and Sound", "Introduction to wave properties and sound phenomena.", "30 min", 4)
            ],
            tags=["physics", "science", "beginner"]
        )
        
        # Programming Courses
        programming_intro = Course(
            id="prog-001",
            title="Introduction to Programming",
            description="Learn programming fundamentals using Python. Perfect for complete beginners.",
            instructor="Alex Thompson",
            subject="Programming",
            difficulty="Beginner",
            duration="6 weeks",
            lessons=[
                Lesson("lesson-13", "Getting Started with Python", "Installing Python and writing your first program.", "20 min", 1),
                Lesson("lesson-14", "Variables and Data Types", "Understanding different types of data in programming.", "25 min", 2),
                Lesson("lesson-15", "Control Structures", "Learning about if statements, loops, and decision making.", "30 min", 3),
                Lesson("lesson-16", "Functions and Modules", "Creating reusable code with functions and modules.", "35 min", 4)
            ],
            tags=["python", "programming", "beginner"]
        )
        
        web_dev = Course(
            id="prog-002",
            title="Web Development Fundamentals",
            description="Learn HTML, CSS, and JavaScript to build modern websites.",
            instructor="Jessica Martinez",
            subject="Programming",
            difficulty="Intermediate",
            duration="10 weeks",
            lessons=[
                Lesson("lesson-17", "HTML Basics", "Structure your web pages with HTML elements.", "25 min", 1),
                Lesson("lesson-18", "CSS Styling", "Make your websites beautiful with CSS.", "30 min", 2),
                Lesson("lesson-19", "JavaScript Fundamentals", "Add interactivity with JavaScript.", "35 min", 3),
                Lesson("lesson-20", "Responsive Design", "Create websites that work on all devices.", "40 min", 4)
            ],
            tags=["html", "css", "javascript", "web development"]
        )
        
        # Language Arts
        writing_course = Course(
            id="lang-001",
            title="Creative Writing Workshop",
            description="Develop your creative writing skills through exercises and feedback.",
            instructor="Prof. David Wilson",
            subject="Language Arts",
            difficulty="Intermediate",
            duration="8 weeks",
            lessons=[
                Lesson("lesson-21", "Finding Your Voice", "Discover your unique writing style and voice.", "20 min", 1),
                Lesson("lesson-22", "Character Development", "Creating compelling and realistic characters.", "25 min", 2),
                Lesson("lesson-23", "Plot Structure", "Understanding story arcs and plot development.", "30 min", 3),
                Lesson("lesson-24", "Editing and Revision", "Polishing your work through effective editing.", "28 min", 4)
            ],
            tags=["writing", "creative", "literature"]
        )
        
        # Add courses to store
        for course in [math_basic, math_advanced, physics_basic, programming_intro, web_dev, writing_course]:
            self.courses[course.id] = course
    
    def _create_sample_resources(self):
        resources = [
            Resource("res-001", "Algebra Formula Sheet", "Comprehensive formula sheet for algebra students", "Mathematics", "PDF", "#", "2.5 MB"),
            Resource("res-002", "Physics Constants Reference", "Essential physics constants and formulas", "Science", "PDF", "#", "1.8 MB"),
            Resource("res-003", "Python Cheat Sheet", "Quick reference for Python syntax and functions", "Programming", "PDF", "#", "3.2 MB"),
            Resource("res-004", "HTML5 Tags Reference", "Complete guide to HTML5 elements and attributes", "Programming", "PDF", "#", "2.1 MB"),
            Resource("res-005", "Writing Style Guide", "Comprehensive guide to academic and creative writing", "Language Arts", "PDF", "#", "4.5 MB"),
            Resource("res-006", "Calculus Practice Problems", "100+ practice problems with solutions", "Mathematics", "PDF", "#", "6.8 MB"),
            Resource("res-007", "Chemistry Periodic Table", "Interactive periodic table with element details", "Science", "HTML", "#", "500 KB"),
            Resource("res-008", "JavaScript Examples", "Code examples for common JavaScript patterns", "Programming", "ZIP", "#", "12.3 MB")
        ]
        
        for resource in resources:
            self.resources[resource.id] = resource
    
    def get_all_courses(self) -> List[Course]:
        return list(self.courses.values())
    
    def get_course_by_id(self, course_id: str) -> Optional[Course]:
        return self.courses.get(course_id)
    
    def get_courses_by_subject(self, subject: str) -> List[Course]:
        return [course for course in self.courses.values() if course.subject.lower() == subject.lower()]
    
    def search_courses(self, query: str) -> List[Course]:
        query = query.lower()
        results = []
        for course in self.courses.values():
            if (query in course.title.lower() or 
                query in course.description.lower() or 
                query in course.subject.lower() or
                any(query in tag.lower() for tag in course.tags)):
                results.append(course)
        return results
    
    def get_all_resources(self) -> List[Resource]:
        return list(self.resources.values())
    
    def get_resources_by_category(self, category: str) -> List[Resource]:
        return [resource for resource in self.resources.values() if resource.category.lower() == category.lower()]
    
    def get_subjects(self) -> List[str]:
        subjects = set(course.subject for course in self.courses.values())
        return sorted(list(subjects))
    
    def get_lesson_by_id(self, course_id: str, lesson_id: str) -> Optional[Lesson]:
        course = self.get_course_by_id(course_id)
        if course:
            for lesson in course.lessons:
                if lesson.id == lesson_id:
                    return lesson
        return None
    
    def update_user_progress(self, user_id: str, course_id: str, lesson_id: str):
        key = f"{user_id}_{course_id}"
        if key not in self.user_progress:
            self.user_progress[key] = UserProgress(
                user_id=user_id,
                course_id=course_id,
                completed_lessons=[],
                last_accessed=datetime.now(),
                progress_percentage=0.0
            )
        
        progress = self.user_progress[key]
        if lesson_id not in progress.completed_lessons:
            progress.completed_lessons.append(lesson_id)
        
        progress.last_accessed = datetime.now()
        
        # Calculate progress percentage
        course = self.get_course_by_id(course_id)
        if course:
            total_lessons = len(course.lessons)
            completed_lessons = len(progress.completed_lessons)
            progress.progress_percentage = (completed_lessons / total_lessons) * 100
    
    def get_user_progress(self, user_id: str, course_id: str) -> Optional[UserProgress]:
        key = f"{user_id}_{course_id}"
        return self.user_progress.get(key)

# Global data store instance
data_store = DataStore()
