// src/components/NotesView.js - ENHANCED VERSION (FIXED)
export default function NotesView({ notes, theme, selectedTopic, selectedSubTopic }) {
  const getTotalQuestions = () => {
    return notes.reduce((total, note) => {
      return total + note.subTopics.reduce((subTotal, st) => subTotal + st.questions.length, 0);
    }, 0);
  };

  if (!notes.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-600 text-lg mb-4">
          📝 No notes found
        </div>
        {(selectedTopic || selectedSubTopic) ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters or add some questions first!
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add your first question to get started!
          </p>
        )}
      </div>
    );
  }

  const totalQuestions = getTotalQuestions();

  return (
    <div className="space-y-8">
      {/* Filter Results Info */}
      {(selectedTopic || selectedSubTopic) && (
        <div className="no-print bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <span>🔍</span>
            <span>
              Filtered by: 
              {selectedTopic && <span className="font-semibold"> Topic: &quot;{selectedTopic}&quot;</span>}
              {selectedTopic && selectedSubTopic && <span> → </span>}
              {selectedSubTopic && <span className="font-semibold"> Sub-topic: &quot;{selectedSubTopic}&quot;</span>}
            </span>
            <span className="ml-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-blue-900 dark:text-blue-100 font-medium">
              {totalQuestions} result{totalQuestions !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {notes.map((note, noteIndex) => (
        <div key={`${note._id || noteIndex}`} className="print-avoid-break">
          {/* Topic Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 border-b-2 border-primary-500 pb-2 mb-6">
              {note.topic}
            </h1>
          </div>

          {/* Sub-topics */}
          {note.subTopics.map((subTopic, subIndex) => (
            <div key={`${subTopic._id || subIndex}`} className="mb-8 print-avoid-break">
              <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mb-4 border-l-4 border-primary-500 pl-4">
                {subTopic.name}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                  ({subTopic.questions.length} question{subTopic.questions.length !== 1 ? 's' : ''})
                </span>
              </h2>

              {/* Questions */}
              <div className="space-y-4">
                {subTopic.questions.map((question, qIndex) => (
                  <div key={`${question._id || qIndex}`} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 print-avoid-break shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Question Title */}
                      <div className="flex items-start gap-3 justify-between">
                        
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                          PS &gt;&gt; {question.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 shrink-0">
                          {question.id}
                        </span>
                      </div>

                      {/* Pattern */}
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300 shrink-0 w-20">
                          Pattern:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                          {question.pattern}
                        </span>
                      </div>

                      {/* Trick */}
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-green-700 dark:text-green-300 shrink-0 w-20">
                          Trick:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                          {question.trick}
                        </span>
                      </div>

                      {/* Error and Edge on same line */}
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-red-700 dark:text-red-300 shrink-0">
                          Wrong i do ⚠️:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded mr-4">
                          {question.error}
                        </span>
                        </div>
                        <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300 shrink-0">
                          Edge case 💡:
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                          {question.edge}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}