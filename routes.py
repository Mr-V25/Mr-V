from flask import render_template, request, redirect, url_for, session, flash, jsonify
from app import app
from data_store import data_store
import uuid

@app.route('/')
def index():
    featured_courses = data_store.get_all_courses()[:3]  # Get first 3 courses as featured
    subjects = data_store.get_subjects()
    return render_template('index.html', featured_courses=featured_courses, subjects=subjects)

@app.route('/courses')
def courses():
    subject_filter = request.args.get('subject', '')
    difficulty_filter = request.args.get('difficulty', '')
    
    courses = data_store.get_all_courses()
    
    if subject_filter:
        courses = [c for c in courses if c.subject.lower() == subject_filter.lower()]
    
    if difficulty_filter:
        courses = [c for c in courses if c.difficulty.lower() == difficulty_filter.lower()]
    
    subjects = data_store.get_subjects()
    difficulties = ['Beginner', 'Intermediate', 'Advanced']
    
    return render_template('courses.html', 
                         courses=courses, 
                         subjects=subjects, 
                         difficulties=difficulties,
                         current_subject=subject_filter,
                         current_difficulty=difficulty_filter)

@app.route('/course/<course_id>')
def course_detail(course_id):
    course = data_store.get_course_by_id(course_id)
    if not course:
        flash('Course not found', 'error')
        return redirect(url_for('courses'))
    
    # Get user progress if session exists
    user_id = session.get('user_id')
    progress = None
    if user_id:
        progress = data_store.get_user_progress(user_id, course_id)
    
    return render_template('course_detail.html', course=course, progress=progress)

@app.route('/course/<course_id>/lesson/<lesson_id>')
def lesson(course_id, lesson_id):
    course = data_store.get_course_by_id(course_id)
    if not course:
        flash('Course not found', 'error')
        return redirect(url_for('courses'))
    
    lesson = data_store.get_lesson_by_id(course_id, lesson_id)
    if not lesson:
        flash('Lesson not found', 'error')
        return redirect(url_for('course_detail', course_id=course_id))
    
    # Ensure user has a session ID for progress tracking
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    
    # Update progress
    data_store.update_user_progress(session['user_id'], course_id, lesson_id)
    
    # Get updated progress
    progress = data_store.get_user_progress(session['user_id'], course_id)
    
    # Find current lesson index and next/previous lessons
    current_index = next((i for i, l in enumerate(course.lessons) if l.id == lesson_id), 0)
    next_lesson = course.lessons[current_index + 1] if current_index + 1 < len(course.lessons) else None
    prev_lesson = course.lessons[current_index - 1] if current_index > 0 else None
    
    return render_template('lesson.html', 
                         course=course, 
                         lesson=lesson, 
                         progress=progress,
                         next_lesson=next_lesson,
                         prev_lesson=prev_lesson)

@app.route('/search')
def search():
    query = request.args.get('q', '')
    results = []
    
    if query:
        results = data_store.search_courses(query)
    
    return render_template('search.html', query=query, results=results)

@app.route('/resources')
def resources():
    category_filter = request.args.get('category', '')
    
    all_resources = data_store.get_all_resources()
    
    if category_filter:
        resources = data_store.get_resources_by_category(category_filter)
    else:
        resources = all_resources
    
    # Get all categories
    categories = list(set(r.category for r in all_resources))
    categories.sort()
    
    return render_template('resources.html', 
                         resources=resources, 
                         categories=categories,
                         current_category=category_filter)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # In a real application, you would send an email or save to database
        # For now, just show a success message
        flash(f'Thank you {name}! Your message has been sent successfully.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('base.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('base.html'), 500
