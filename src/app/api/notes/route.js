// src/app/api/notes/route.js - ENHANCED VERSION
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

export async function GET() {
  try {
    await dbConnect();
    const notes = await Note.find({}).sort({ updatedAt: -1 });
    return Response.json(notes);
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    const { topic, subTopic, questionId, title, pattern, trick, error, edge } = data;
    
    if (!topic || !subTopic || !questionId || !title || !pattern || !trick || !error || !edge) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Find existing note or create new one
    let note = await Note.findOne({ topic });
    
    if (!note) {
      note = new Note({
        topic,
        subTopics: []
      });
    }

    // Find existing sub-topic or create new one
    let subTopicIndex = note.subTopics.findIndex(st => st.name === subTopic);
    
    if (subTopicIndex === -1) {
      note.subTopics.push({
        name: subTopic,
        questions: []
      });
      subTopicIndex = note.subTopics.length - 1;
    }

    // Check if question ID already exists in this subtopic
    const existingQuestion = note.subTopics[subTopicIndex].questions.find(q => q.id === questionId);
    if (existingQuestion) {
      return Response.json({ error: 'Question ID already exists in this sub-topic' }, { status: 400 });
    }

    // Add question to sub-topic
    const newQuestion = {
      id: questionId,
      title,
      pattern,
      trick,
      error,
      edge,
      createdAt: new Date()
    };

    note.subTopics[subTopicIndex].questions.push(newQuestion);
    note.updatedAt = new Date();

    await note.save();
    
    return Response.json({ message: 'Question added successfully', note });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Failed to add question' }, { status: 500 });
  }
}