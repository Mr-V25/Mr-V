from dataclasses import dataclass
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class Lesson:
    id: str
    title: str
    content: str
    duration: str
    order: int
    video_url: Optional[str] = None
    
@dataclass
class Course:
    id: str
    title: str
    description: str
    instructor: str
    subject: str
    difficulty: str
    duration: str
    lessons: List[Lesson]
    thumbnail: str = ""
    tags: List[str] = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []

@dataclass
class Resource:
    id: str
    title: str
    description: str
    category: str
    file_type: str
    download_url: str
    size: str

@dataclass
class UserProgress:
    user_id: str
    course_id: str
    completed_lessons: List[str]
    last_accessed: datetime
    progress_percentage: float
