import { useState } from 'react';
import { subjectAPI } from '../../services/api';

function AddSubjectModal({ semesterId, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('THEORY');
  const [totalClasses, setTotalClasses] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name) {
      setError('Please enter subject name');
      return;
    }

    setLoading(true);

    try {
      const subjectData = {
        name,
        type,
        semesterId,
        totalClasses: totalClasses ? parseInt(totalClasses) : null
      };

      // Only add totalClasses if it's provided
      if (totalClasses && parseInt(totalClasses) > 0) {
        subjectData.totalClasses = parseInt(totalClasses);
      }

      await subjectAPI.create(subjectData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create subject');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">ADD SUBJECT</h2>
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
          <div className="mb-4">
            <label className="block font-bold mb-2 text-sm">SUBJECT NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Data Structures"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-sm">SUBJECT TYPE</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black bg-white"
              disabled={loading}
            >
              <option value="THEORY">THEORY</option>
              <option value="PRACTICAL">PRACTICAL</option>
              <option value="TUTORIAL">TUTORIAL</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-bold mb-2 text-sm">
              TOTAL CLASSES IN SEMESTER
              <span className="text-gray-500 font-normal"> (Optional)</span>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'CREATING...' : 'ADD SUBJECT'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSubjectModal;