'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">

        <h1>
          Welcome Back
        </h1>

        <p>
          Sign in to Fliby Event
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Sign In
          </button>

          <p className="signupText">
            Don&apos;t have an account?{' '}
            
            <span
              onClick={() => router.push('/signup')}
              className="signupLink"
            >
              Sign up
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}