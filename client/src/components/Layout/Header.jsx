import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black">ATTENDLY</h1>
          <p className="text-sm mt-1">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="bg-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          ↗ LOGOUT
        </button>
      </div>
    </div>
  );
}

export default Header;