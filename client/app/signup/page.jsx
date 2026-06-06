'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { supabase } from '../../lib/supabase';

export default function SignupPage() {

  const router = useRouter();

  const [fullName, setFullName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [profileImage, setProfileImage] =
    useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    let imageUrl = '';

    if (profileImage) {

      const fileName =
        `${Date.now()}-${profileImage.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from('profiles')
          .upload(fileName, profileImage);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {

      await supabase
        .from('users')
        .insert([
          {
            email,
            full_name: fullName,
            profile_image: imageUrl,
          },
        ]);

        alert(
          'Account created successfully!'
        );

      router.push('/login');
      router.refresh();
    }
  };

  return (
    <div className="authPage">

      <div className="authCard">

        <h1>
          Create Account
        </h1>

        <p>
          Join Fliby Event today
        </p>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <label className="profileUploadLabel">
            Upload Profile Picture
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProfileImage(
                e.target.files[0]
              )
            }
            required
          />

          <button
            type="button"
            onClick={handleSignup}
          >
            Sign Up
          </button>

        </form>

        <div className="authBottomText">

          <p>
            Already have an account?
          </p>

          <Link href="/login">
            Sign In
          </Link>

        </div>

      </div>

    </div>
  );
}