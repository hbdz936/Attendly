import { useState } from 'react';
import { semesterAPI } from '../../services/api';

function AddSemesterModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !startDate || !endDate) {
      setError('Please fill all fields');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      await semesterAPI.create({ name, startDate, endDate });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create semester');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">ADD SEMESTER</h2>
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
            <label className="block font-bold mb-2 text-sm">SEMESTER NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Aug-Dec 2024"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-sm">START DATE</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-bold mb-2 text-sm">END DATE</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'CREATING...' : 'ADD SEMESTER'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSemesterModal;