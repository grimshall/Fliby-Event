'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { useRouter }
from 'next/navigation';

import { supabase }
from '../lib/supabase';

const malaysiaStates = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Kuala Lumpur',
  'Labuan',
  'Putrajaya'
];

import Link from 'next/link';

const Navbar = () => {

  const router = useRouter();

  const [search, setSearch] =
    useState('');

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [profileImage, setProfileImage] =
    useState('');

  const [user, setUser] =
    useState(null);

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUser(null);
      return;
    }

    setUser(user);

    const { data } = await supabase
      .from('users')
      .select('profile_image')
      .eq('email', user.email)
      .single();

    if (data?.profile_image) {
      setProfileImage(data.profile_image);
    }
  };

  const handleSearch = () => {

    if (!search.trim()) return;

    router.push(
      `/search?q=${search}`
    );

  };

  return (
    <nav className="navbar">

      <Link href="/">
        <div className="logoContainer">
        <Image
  src="/bigicon.png"
  alt="Fliby Logo"
  width={230}
  height={80}
  priority
/>
      </div>
      </Link>

      <div className="searchBar">

        <img
          src="/search.jpg"
          alt="search"
          className="icon"
          onClick={handleSearch}
        />

        <input
          type="text"
          placeholder="Search events"
          className="searchInput"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={(e) => {

            if (e.key === 'Enter') {
              handleSearch();
            }

          }}
        />

        <img
          src="/map.jpg"
          alt="map"
          className="icon"
          onClick={() =>
            setShowDropdown(
              !showDropdown
            )
          }
        />

        <span
          className="locationText"
          onClick={() =>
            setShowDropdown(!showDropdown)
          }
        >
          Choose a location
        </span>
        
        {showDropdown && (

          <div className="locationDropdown">

            {malaysiaStates.map((state) => (

              <p
                key={state}
                onClick={() =>
                  router.push(
                    `/search-location?state=${state}`
                  )
                }
              >
                {state}
              </p>

            ))}

          </div>

)}

      </div>

      <div className="navLinks">

        <a href="#">
          Find Event
        </a>

        <a href="/create-event">
          Create Event
        </a>

        <a href="#">
          Help Center
        </a>

        <a href="/ticket-history">
          Ticket History
        </a>

        <div className="profileWrapper">

          <div
            onClick={() =>
              setShowProfileMenu(
                !showProfileMenu
              )
            }
          >

            {profileImage ? (

              <img
                src={profileImage}
                alt="profile"
                className="profileImage"
              />

            ) : (

              <div className="profileIcon"></div>

            )}

          </div>

          {showProfileMenu && (

            <div className="profileDropdown">

              {user ? (

                <>

                  <Link href="/profile">
                    View Profile
                  </Link>

                  <button
                    onClick={async () => {

                      await supabase.auth.signOut();

                      router.push('/login');

                      router.refresh();

                    }}
                    className="logoutButton"
                  >
                    Log Out
                  </button>

                </>

              ) : (

                <>

                  <Link href="/login">
                    Login
                  </Link>

                  <Link href="/signup">
                    Sign Up
                  </Link>

                </>

              )}

            </div>

          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;