import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await signup(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8">
          <h1 className="text-4xl font-black mb-2">ATTENDLY</h1>
          <p className="text-sm">Your attendance ally</p>
        </div>

        {/* SignUp Form */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <h2 className="text-3xl font-black mb-6">SIGN UP</h2>
          
          {error && (
            <div className="bg-red-100 border-2 border-red-500 p-3 mb-4">
              <p className="text-red-700 text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-bold mb-2 text-sm">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="your@email.com"
                disabled={loading}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2 text-sm">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••"
                disabled={loading}
                required
                minLength={6}
              />
              <p className="text-xs mt-1 text-gray-600">Minimum 6 characters</p>
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2 text-sm">CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••"
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3 px-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            <Link
              to="/login"
              className="font-bold underline hover:no-underline"
            >
              ALREADY HAVE AN ACCOUNT? LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;