'use client';



import {
  useEffect,
  useState,
} from 'react';

import Navbar from '../../components/Navbar';

import { supabase }
from '../../lib/supabase';

export default function ProfilePage() {

  const [profile, setProfile] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [createdEvents, setCreatedEvents] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState('history');

  const [showEditModal, setShowEditModal] =
  useState(false);

  const [editFullName, setEditFullName] =
    useState('');

  const [editEmail, setEditEmail] =
    useState('');

  const [editBio, setEditBio] =
    useState('');

  const [editImage, setEditImage] =
    useState(null);

  const [previewImage, setPreviewImage] =
    useState('');

    const [showSocialModal, setShowSocialModal] =
  useState(false);

const [selectedSocial, setSelectedSocial] =
  useState('');

const [socialValue, setSocialValue] =
  useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData =
    async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // USER PROFILE
    const {
      data: profileData,
    } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    setProfile(profileData);

    setEditFullName(
      profileData.full_name || ''
    );

    setEditEmail(
      profileData.email || ''
    );

    setEditBio(
      profileData.bio || ''
    );

    setPreviewImage(
      profileData.profile_image || ''
    );

    // EVENT HISTORY
    const {
      data: historyData,
    } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', {
        ascending: false,
      });

    setHistory(historyData || []);

    // CREATED EVENTS
    const {
      data: createdData,
    } = await supabase
      .from('events')
      .select('*')
      .eq(
        'host_name',
        profileData?.full_name
      )
      .order('id', {
        ascending: false,
      });

    setCreatedEvents(
      createdData || []
    );
  };

  if (!profile) {
    return <p>Loading...</p>;
  }


  const handleUpdateProfile =
  async () => {

  let imageUrl =
    profile.profile_image;

  // NEW IMAGE
  if (editImage) {

    const fileName =
      `${Date.now()}-${editImage.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from('profiles')
        .upload(fileName, editImage);

    if (!uploadError) {

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }
  }

  const { error } =
    await supabase
      .from('users')
      .update({
        full_name:
          editFullName,

        email:
          editEmail,

        bio:
          editBio,

        profile_image:
          imageUrl,
      })
      .eq('id', profile.id);

  if (error) {
    alert(error.message);
    return;
  }

  setProfile({
    ...profile,
    full_name:
      editFullName,

    email:
      editEmail,

    bio:
      editBio,

    profile_image:
      imageUrl,
  });

  setShowEditModal(false);

  alert(
    'Profile updated successfully!'
  );
};


  const handleSaveSocial =
async () => {

  const { error } =
    await supabase
      .from('users')
      .update({
        [selectedSocial]:
          socialValue,
      })
      .eq('id', profile.id);

  if (error) {
    alert(error.message);
    return;
  }

  setProfile({
    ...profile,
    [selectedSocial]:
      socialValue,
  });

  setSocialValue('');
  setSelectedSocial('');

  alert('Social updated!');
};

  return (
    <div>

      {showEditModal && (

  <div className="editModalOverlay">

    <div className="editModal">

      <h2>Edit Profile</h2>

      <div className="editProfileImageContainer">

        <img
          src={previewImage}
          alt="profile"
          className="editProfileImage"
        />

      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {

          setEditImage(
            e.target.files[0]
          );

          setPreviewImage(
            URL.createObjectURL(
              e.target.files[0]
            )
          );
        }}
      />

      <input
        type="text"
        placeholder="Full name"
        value={editFullName}
        onChange={(e) =>
          setEditFullName(
            e.target.value
          )
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={editEmail}
        onChange={(e) =>
          setEditEmail(
            e.target.value
          )
        }
      />

      <textarea
        placeholder="Add bio"
        value={editBio}
        onChange={(e) =>
          setEditBio(
            e.target.value
          )
        }
        rows="6"
      />

      <div className="editModalButtons">

        <button
          className="saveProfileButton"
          onClick={
            handleUpdateProfile
          }
        >
          Save Changes
        </button>

        <button
          className="cancelProfileButton"
          onClick={() =>
            setShowEditModal(
              false
            )
          }
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}

      <Navbar />

      <div className="profilePage">

        {/* LEFT SIDE */}

        <div className="profileLeft">

          {/* PROFILE CARD */}

          <div className="profileCard">

            <div className="profileTop">

              <div className="profileHeader">

                <img
                  src={
                    profile.profile_image
                  }
                  alt="profile"
                  className="profileImageLarge"
                />

                <div>

                  <h1>
                    {profile.full_name}
                  </h1>

                  <p className="joinedText">

                  Joined Fliby since{' '}

                  {new Date(
                    profile.created_at
                  ).toLocaleDateString('en-MY', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}

                </p>

                </div>

              </div>

              <button
                className="editButton"
                onClick={() =>
                  setShowEditModal(true)
                }
              >
                Edit Profile
              </button>

            </div>

            <p className="profileBio">

              {profile.bio ||
                'No bio added yet.'}

            </p>

            {/* TABS */}

            <div className="profileTabs">

              <button
                className={
                  activeTab ===
                  'history'
                    ? 'activeTab'
                    : ''
                }
                onClick={() =>
                  setActiveTab(
                    'history'
                  )
                }
              >
                Event History
              </button>

              <button
                className={
                  activeTab ===
                  'created'
                    ? 'activeTab'
                    : ''
                }
                onClick={() =>
                  setActiveTab(
                    'created'
                  )
                }
              >
                Events Created
              </button>

            </div>

          </div>

          {/* EVENT HISTORY */}

          {activeTab ===
            'history' && (

            <div className="profileEventsContainer">

              <div className="profileEventList">

                {history.length === 0 ? (

                  <div className="emptyEventText">
                    You have not joined any event
                  </div>

                ) : (

                  history.map(
                  (event) => (

                    <div
                      className="profileEventCard"
                      key={event.id}
                    >

                      <img
                        src={
                          event.event_image
                        }
                        alt="event"
                        className="profileEventImage"
                      />

                      <div className="profileEventInfo">

                        <h2>
                          {
                            event.event_title
                          }
                        </h2>

                        <p>
                          Quantity:
                          {' '}
                          {
                            event.quantity
                          }
                        </p>

                        <p>
                          Total:
                          {' '}
                          {event.total}
                        </p>

                        <p>
                          Ticket ID:
                          {' '}
                          {
                            event.ticket_id
                          }
                        </p>

                      </div>

                    </div>

                  ))
                )}

              </div>

            </div>
         

          )}
          

          {/* CREATED EVENTS */}

          {activeTab ===
            'created' && (

            <div className="profileEventsContainer">

            <div className="profileEventList">

              {createdEvents.length === 0 ? (

                <div className="emptyEventText">
                  You have not created any event
                </div>

              ) : (

                createdEvents.map(
                (event) => (

                 <div
                    className="profileEventCard"
                    key={event.id}
                    >

                    <img
                        src={event.image}
                        alt="event"
                        className="profileEventImage"
                    />

                    <div className="profileEventInfo">

                      <h2>
                        {event.title}
                      </h2>

                      <p>
                        Category:
                        {' '}
                        {
                          event.category
                        }
                      </p>

                      <p>
                        State:
                        {' '}
                        {event.state}
                      </p>

                      <p>
                        Price:
                        {' '}
                        {event.price}
                      </p>

                    </div>

                  </div>

                ))
              )}

            </div>
            </div>

          )}

        </div>

        

        {/* RIGHT SIDE */}

        <div className="profileRight">

          <div className="socialCard">

            <div className="socialTop">

              <h2>
                Socials
              </h2>

              <button
                className="editButton"
                onClick={() =>
                  setShowSocialModal(true)
                }
              >
                Edit Socials
              </button>

             {showSocialModal && (

  <div className="modalOverlay">

    <div className="socialModal">

      <h2>Edit Socials</h2>

     <div className="socialBubbleContainer">

  <button
    onClick={() => {

      setSelectedSocial(
        'instagram'
      );

      setSocialValue(
        profile.instagram || ''
      );
    }}
  >
    Instagram
  </button>

  <button
    onClick={() => {

      setSelectedSocial(
        'linkedin'
      );

      setSocialValue(
        profile.linkedin || ''
      );
    }}
  >
    LinkedIn
  </button>

  <button
    onClick={() => {

      setSelectedSocial(
        'github'
      );

      setSocialValue(
        profile.github || ''
      );
    }}
  >
    GitHub
  </button>

  <button
    onClick={() => {

      setSelectedSocial(
        'twitter'
      );

      setSocialValue(
        profile.twitter || ''
      );
    }}
  >
    Twitter
  </button>

  <button
    onClick={() => {

      setSelectedSocial(
        'discord'
      );

      setSocialValue(
        profile.discord || ''
      );
    }}
  >
    Discord
  </button>

</div>

      {selectedSocial && (

        <div className="socialForm">

          <label>
            {selectedSocial}
          </label>

          <input
  type="text"

  placeholder={
    selectedSocial === 'instagram'
      ? '@yourinstagram'

    : selectedSocial === 'linkedin'
      ? 'www.linkedin.com/in/example-1234a'

    : selectedSocial === 'github'
      ? 'yourgithubname'

    : selectedSocial === 'twitter'
      ? '@yourtwitter'

    : 'yourdiscordname'
  }

  value={socialValue}

  onChange={(e) => {

    let value = e.target.value;

    // REMOVE @ FOR INSTAGRAM
    if (
      selectedSocial === 'instagram'
    ) {
      value = value.replace('@', '');
    }

    // REMOVE @ FOR TWITTER
    if (
      selectedSocial === 'twitter'
    ) {
      value = value.replace('@', '');
    }

    setSocialValue(value);
  }}
/>

          <button
            onClick={handleSaveSocial}
          >
            Save Social
          </button>

        </div>

      )}

      <button
      className="closeSocialButton"
      onClick={() =>
        setShowSocialModal(false)
      }
    >
      Close
    </button>

    </div>

  </div>

)}

            </div>

{!profile.twitter &&
 !profile.instagram &&
 !profile.linkedin &&
 !profile.github &&
 !profile.discord ? (

  <p className="noSocialsText">
    You have not put any of your socials
  </p>

) : (

  <>

   {profile.twitter && (
  <div className="socialItem">

    <span>Twitter</span>

    <a
      href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      @{profile.twitter.replace('@', '')}
    </a>

  </div>
)}

    {profile.instagram && (
  <div className="socialItem">

    <span>Instagram</span>

    <a
      href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      @{profile.instagram.replace('@', '')}
    </a>

  </div>
)}

    {profile.linkedin && (
  <div className="socialItem">

    <span>LinkedIn</span>

    <a
      href={
        profile.linkedin.startsWith('http')
          ? profile.linkedin
          : `https://${profile.linkedin}`
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      View Profile
    </a>

  </div>
)}

    {profile.github && (
      <div className="socialItem">

        <span>GitHub</span>

        <a
          href={`https://github.com/${profile.github}`}
          target="_blank"
        >
          @{profile.github}
        </a>

      </div>
    )}

    {profile.discord && (
      <div className="socialItem">

        <span>Discord</span>

        <p>{profile.discord}</p>

      </div>
    )}

  </>

)}
          </div>

        </div>

      </div>

    </div>
  );
}