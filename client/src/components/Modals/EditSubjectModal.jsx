import { useState } from 'react';
import { subjectAPI } from '../../services/api';

function EditSubjectModal({ subject, onClose, onSuccess }) {
  const [totalClasses, setTotalClasses] = useState(subject.totalClasses ?? '');
  const [classesHeld, setClassesHeld] = useState(subject.classesHeld ?? 0);
  const [classesAttended, setClassesAttended] = useState(subject.classesAttended ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (classesAttended > classesHeld) {
      setError('Classes attended cannot exceed classes held');
      return;
    }

    if (totalClasses && classesHeld > parseInt(totalClasses)) {
      setError('Classes held cannot exceed total classes');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        classesHeld: parseInt(classesHeld) || 0,
        classesAttended: parseInt(classesAttended) || 0,
        totalClasses: totalClasses ? parseInt(totalClasses) : null
      };

      await subjectAPI.update(subject._id, updateData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update subject');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">EDIT {subject.name}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-gray-600"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 p-3 mb-4">
            <p className="text-red-700 text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Total Classes */}
          <div className="mb-4">
            <label className="block font-bold mb-2 text-sm">
              TOTAL CLASSES IN SEMESTER
              <span className="text-gray-500 font-normal"> (Add an approx)</span>
            </label>
            <input
              type="number"
              value={totalClasses}
              onChange={(e) => setTotalClasses(e.target.value)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., 40"
              min="1"
              disabled={loading}
            />
            <p className="text-xs text-gray-600 mt-1">
              Leave empty if you don't know the total
            </p>
          </div>

          {/* Classes Held */}
          <div className="mb-4">
            <label className="block font-bold mb-2 text-sm">CLASSES HELD</label>
            <input
              type="number"
              value={classesHeld}
              onChange={(e) => setClassesHeld(parseInt(e.target.value) || 0)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
              min="0"
              disabled={loading}
              required
            />
          </div>

          {/* Classes Attended */}
          <div className="mb-6">
            <label className="block font-bold mb-2 text-sm">CLASSES ATTENDED</label>
            <input
              type="number"
              value={classesAttended}
              onChange={(e) => setClassesAttended(parseInt(e.target.value) || 0)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
              min="0"
              max={classesHeld}
              disabled={loading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-white font-bold py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕ CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white font-bold py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SAVING...' : '✓ SAVE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSubjectModal;
