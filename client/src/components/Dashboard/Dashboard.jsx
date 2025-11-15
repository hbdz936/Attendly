import { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import SemesterCard from './SemesterCard';
import SubjectCard from './SubjectCard';
import AddSemesterModal from '../Modals/AddSemesterModal';
import AddSubjectModal from '../Modals/AddSubjectModal';
import EditSubjectModal from '../Modals/EditSubjectModal';
import { semesterAPI, subjectAPI } from '../../services/api';

function Dashboard() {
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeSemester, setActiveSemester] = useState(null);
  const [showAddSemester, setShowAddSemester] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSemesters();
  }, []);

  useEffect(() => {
    if (activeSemester) {
      loadSubjects(activeSemester);
    }
  }, [activeSemester]);

  const loadSemesters = async () => {
    try {
      console.log('Loading semesters...');
      const data = await semesterAPI.getAll();
      console.log('Semesters response:', data);
      
      // Handle response with proper null checks
      const semestersArray = data?.semesters || [];
      setSemesters(semestersArray);
      
      if (semestersArray.length > 0 && !activeSemester) {
        setActiveSemester(semestersArray[0]._id);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load semesters:', err);
      console.error('Error details:', err.response?.data || err.message);
      setSemesters([]);
      setLoading(false);
    }
  };

  const loadSubjects = async (semesterId) => {
    try {
      console.log('Loading subjects for semester:', semesterId);
      const data = await subjectAPI.getAll(semesterId);
      console.log('Subjects response:', data);
      
      // Handle response with proper null checks
      const subjectsArray = data?.subjects || [];
      setSubjects(subjectsArray);
    } catch (err) {
      console.error('Failed to load subjects:', err);
      console.error('Error details:', err.response?.data || err.message);
      setSubjects([]);
    }
  };

  const handleDeleteSemester = async (id) => {
    if (!window.confirm('Delete this semester and all its subjects?')) return;
    
    try {
      await semesterAPI.delete(id);
      loadSemesters();
      setActiveSemester(null);
      setSubjects([]);
    } catch (err) {
      console.error('Delete semester error:', err);
      alert(err.response?.data?.message || 'Failed to delete semester');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    
    try {
      await subjectAPI.delete(id);
      loadSubjects(activeSemester);
    } catch (err) {
      console.error('Delete subject error:', err);
      alert(err.response?.data?.message || 'Failed to delete subject');
    }
  };

  const handleUpdateAttendance = async (id, attended) => {
    try {
      await subjectAPI.updateAttendance(id, attended);
      loadSubjects(activeSemester);
    } catch (err) {
      console.error('Update attendance error:', err);
      alert(err.response?.data?.message || 'Failed to update attendance');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="font-bold">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      <Header />

      {/* Semesters Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="text-2xl font-black">YOUR SEMESTERS</h2>
          <button
            onClick={() => setShowAddSemester(true)}
            className="bg-black text-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            + ADD SEMESTER
          </button>
        </div>

        {semesters.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="text-lg font-bold mb-2">No semesters yet!</p>
            <p className="text-sm text-gray-600">Click "ADD SEMESTER" to get started</p>
          </div>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {semesters.map((semester) => (
              <SemesterCard
                key={semester._id}
                semester={semester}
                isActive={activeSemester === semester._id}
                onClick={() => setActiveSemester(semester._id)}
                onDelete={() => handleDeleteSemester(semester._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subjects Section */}
      {activeSemester && (
        <div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="text-2xl font-black">SUBJECTS</h2>
            <button
              onClick={() => setShowAddSubject(true)}
              className="bg-black text-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              + ADD SUBJECT
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="bg-white border-4 border-black p-8 text-center">
              <p className="text-lg font-bold mb-2">No subjects yet!</p>
              <p className="text-sm text-gray-600">Click "ADD SUBJECT" to start tracking attendance</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject._id}
                  subject={subject}
                  onEdit={() => setEditingSubject(subject)}
                  onDelete={() => handleDeleteSubject(subject._id)}
                  onUpdateAttendance={(attended) => handleUpdateAttendance(subject._id, attended)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddSemester && (
        <AddSemesterModal
          onClose={() => setShowAddSemester(false)}
          onSuccess={() => {
            loadSemesters();
            setShowAddSemester(false);
          }}
        />
      )}

      {showAddSubject && activeSemester && (
        <AddSubjectModal
          semesterId={activeSemester}
          onClose={() => setShowAddSubject(false)}
          onSuccess={() => {
            loadSubjects(activeSemester);
            setShowAddSubject(false);
          }}
        />
      )}

      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onSuccess={() => {
            loadSubjects(activeSemester);
            setEditingSubject(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;