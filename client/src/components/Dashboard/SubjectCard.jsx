function SubjectCard({ subject, onEdit, onDelete, onUpdateAttendance }) {
  console.log('Subject data:', subject); // Add this line
  const percentage = parseFloat(subject.attendancePercentage);
  // Determine background color based on percentage
  const bgColor =
    percentage >= 75 ? 'bg-green-200' :
    percentage >= 65 ? 'bg-yellow-200' : 'bg-red-200';

  // Check if total classes is set
  const hasTotalClasses = subject.totalClasses && subject.totalClasses > 0;
  const remaining = subject.remainingClasses;
  const canReach = subject.canReachTarget;
  const bestPossible = subject.bestPossiblePercentage;

  return (
    <div className={`${bgColor} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black">{subject.name}</h3>
          <p className="text-xs font-bold uppercase">{subject.type}</p>
          {hasTotalClasses && (
            <p className="text-xs font-bold mt-1">
              📊 Total: {subject.totalClasses} classes | Remaining: {remaining}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="bg-white p-2 border-2 border-black hover:bg-gray-100 transition-colors"
            title="Edit subject"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="bg-white p-2 border-2 border-black hover:bg-gray-100 transition-colors"
            title="Delete subject"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="font-bold">HELD:</span>
          <span>{subject.classesHeld}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">ATTENDED:</span>
          <span>{subject.classesAttended}</span>
        </div>
      </div>

      {/* Percentage */}
      <div className="bg-white border-2 border-black p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-bold">PERCENTAGE:</span>
          <span className="text-2xl font-black">{percentage}%</span>
        </div>
      </div>

      {/* Target Status - Show different messages based on situation */}
      {hasTotalClasses ? (
        <>
          {/* If total classes is set, show advanced calculation */}
          {canReach ? (
            <>
              {percentage >= 75 ? (
                <div className="bg-white border-2 border-black p-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs font-bold mb-1">✅ TARGET ACHIEVED!</p>
                    <p className="text-sm">You can miss up to:</p>
                    <p className="text-xl font-black">{subject.canMiss} classes</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-black p-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs font-bold mb-1">🎯 CAN REACH 75%</p>
                    <p className="text-sm">Must attend:</p>
                    <p className="text-xl font-black">
                      {subject.mustAttend} out of {remaining} remaining
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-orange-100 border-2 border-orange-500 p-3 mb-4">
              <div className="text-center">
                <p className="text-xs font-bold mb-1 text-orange-700">⚠️ CANNOT REACH 75%</p>
                <p className="text-sm text-orange-700">Best Possible:</p>
                <p className="text-xl font-black text-orange-700">{bestPossible}%</p>
                <p className="text-xs mt-1 text-orange-600">
                  (even if you attend all {remaining} remaining)
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* If no total classes, show simple calculation */}
          {percentage >= 75 ? (
            <div className="bg-white border-2 border-black p-3 mb-4">
              <div className="text-center">
                <p className="text-xs font-bold mb-1">CAN MISS:</p>
                <p className="text-xl font-black">{subject.canMiss} classes</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-black p-3 mb-4">
              <div className="text-center">
                <p className="text-xs font-bold mb-1">MUST ATTEND:</p>
                <p className="text-xl font-black">{subject.mustAttend} classes</p>
                <p className="text-xs mt-1 text-gray-600">
                  (continuously without missing)
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Buttons - Always keep these! */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onUpdateAttendance(true)}
          className="bg-black text-white font-bold py-2 border-2 border-black hover:bg-gray-800 transition-colors"
          disabled={hasTotalClasses && remaining === 0}
        >
          ✓ PRESENT
        </button>
        <button
          onClick={() => onUpdateAttendance(false)}
          className="bg-white font-bold py-2 border-2 border-black hover:bg-gray-100 transition-colors"
          disabled={hasTotalClasses && remaining === 0}
        >
          ✗ ABSENT
        </button>
      </div>

      {hasTotalClasses && remaining === 0 && (
        <p className="text-center text-xs text-gray-600 mt-2 font-bold">
          📚 All {subject.totalClasses} classes completed!
        </p>
      )}
    </div>
  );
}

export default SubjectCard;