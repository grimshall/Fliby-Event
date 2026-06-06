'use client';

import { useState } from 'react';
import axios from 'axios';


import Navbar from '../../components/Navbar';

import { supabase } from '../../lib/supabase';

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

export default function CreateEventPage() {

const [formData, setFormData] = useState({
  title: '',
  category: '',
  date: '',
  time: '',
  place: '',
  state: '',
  price: '',
  description: '',
});

  const [priceType, setPriceType] =
    useState('paid');

  const [image, setImage] =
    useState(null);

  const [benefitInput, setBenefitInput] =
  useState('');

  const [benefits, setBenefits] =
  useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addBenefit = () => {

  if (
    !benefitInput.trim() ||
    benefits.length >= 10
  ) return;

  setBenefits([
    ...benefits,
    benefitInput
  ]);

  setBenefitInput('');
};

const removeBenefit = (index) => {

  const updatedBenefits =
    benefits.filter(
      (_, i) => i !== index
    );

  setBenefits(updatedBenefits);
};

  const handleSubmit = async (e) => {

    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Please login first');
      return;
    }

    const { data: profileData } =
      await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

    const data = new FormData();

    data.append('title', formData.title);

        data.append(
      'category',
      formData.category
    );

    data.append(
      'date',
      `${formData.date}T${formData.time}`
    );

    data.append('place', formData.place);

    data.append('state', formData.state);

    data.append(
      'price',
      priceType === 'free'
        ? 'Free'
        : `RM${formData.price}`
    );

    data.append(
      'description',
      formData.description
    );

    data.append(
  'benefits',
    JSON.stringify(benefits)
  );

    data.append(
      'host_name',
      profileData.full_name
    );

    data.append(
      'host_id',
      user.id
    );

    data.append('image', image);

    try {

await axios.post(
  'https://fliby-event-production.up.railway.app/events',
  data,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);

      alert(
        'Event created successfully!'
      );

      setFormData({
  title: '',
  category: '',
  date: '',
  time: '',
  place: '',
  state: '',
  price: '',
  description: '',
});

setBenefits([]);

setBenefitInput('');

setImage(null);

setPriceType('paid');

    } catch (err) {

      console.log(err);

      alert(
        'Failed to create event'
      );
    }
  };

  return (
    <div>

      <Navbar />

      <div className="createEventContainer">

        <h1>
          Create Event
        </h1>

        <form
          className="eventForm"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

                <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="categorySelect"
              required
            >

              <option value="">
                Select Category
              </option>

              <option value="AI">
                AI
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Business">
                Business
              </option>

              <option value="Education">
                Education
              </option>

              <option value="Science">
                Science
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Health">
                Health
              </option>

              <option value="Startup">
                Startup
              </option>

            </select>

          <div className="dateTimeGroup">

            <input
              type="date"
              name="date"
              value={formData.date}
              min={
                new Date()
                  .toISOString()
                  .split('T')[0]
              }
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

          </div>

          <input
            type="text"
            name="place"
            placeholder="Venue"
            value={formData.place}
            onChange={handleChange}
            required
          />

          <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="categorySelect"
          required
        >

          <option value="">
            Select State
          </option>

          {malaysiaStates.map((state) => (

            <option
              key={state}
              value={state}
            >
              {state}
            </option>

          ))}

        </select>

          <div className="priceSection">

            <select
              value={priceType}
              onChange={(e) =>
                setPriceType(
                  e.target.value
                )
              }
            >

              <option value="paid">
                Enter Price
              </option>

              <option value="free">
                Free
              </option>

            </select>

            {priceType === 'paid' ? (

              <div className="priceInputWrapper">

                <span className="rmText">
                  RM
                </span>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="25"
                  onChange={handleChange}
                  required
                />

              </div>

            ) : (

              <div className="freeText">
                Free
              </div>

            )}

          </div>

<div className="benefitSection">

  <label>
    Event Benefits
  </label>

  <div className="benefitInputRow">

    <input
      type="text"
      placeholder="Add benefit"
      value={benefitInput}
      onChange={(e) =>
        setBenefitInput(
          e.target.value
        )
      }
      onKeyDown={(e) => {

        if (e.key === 'Enter') {
          e.preventDefault();
          addBenefit();
        }

      }}
    />

    <button
      type="button"
      className="addBenefitBtn"
      onClick={addBenefit}
    >
      +
    </button>

  </div>

  <div className="benefitsContainer">

    {benefits.map(
      (benefit, index) => (

      <div
        key={index}
        className="benefitBubble"
      >

        <span>
          {benefit}
        </span>

        <button
          type="button"
          onClick={() =>
            removeBenefit(index)
          }
        >
          ×
        </button>

      </div>

    ))}

  </div>

</div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            rows="6"
            onChange={handleChange}
            required
          />

          <button type="submit">
            Create Event
          </button>

        </form>

      </div>

    </div>
  );
}