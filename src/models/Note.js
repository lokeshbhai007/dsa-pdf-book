// src/models/Note.js
import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  pattern: { type: String, required: true },
  trick: { type: String, required: true },
  error: { type: String, required: true },
  edge: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const SubTopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

const NoteSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  subTopics: [SubTopicSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
