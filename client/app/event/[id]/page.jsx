'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';


import Navbar from '../../../components/Navbar';

import { supabase } from '../../../lib/supabase';
const formatDate = (dateString) => {

  const date = new Date(dateString);

  return (
    date.toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }
    ) +
    ' • ' +
    date.toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit',
      }
    )
  );
};

export default function EventDetailsPage() {

  const params = useParams();

  const [event, setEvent] =
    useState(null);

  const [showTicketModal, setShowTicketModal] =
    useState(false);

  const [quantity, setQuantity] =
    useState(1);

  useEffect(() => {
    fetchEvent();
  }, []);

const fetchEvent = async () => {

  const { data, error } =
    await supabase
      .from('events')
        .select(`
        id,
        title,
        image,
        date,
        place,
        state,
        price,
        category,
        description,
        benefits,
        host_name,
        host_id
      `)
      .eq('id', params.id)
      .single();

  if (data) {

    // Fetch host profile image
    const { data: hostProfile } =
      await supabase
        .from('users')
        .select('profile_image')
        .eq('full_name', data.host_name)
        .single();

    // Attach profile image to event object
    data.profile_image =
      hostProfile?.profile_image;

    setEvent(data);
  }
};

const handleReserveSpot = async () => {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert('Please login first');
    return;
  }


  // Generate unique ticket id
  const ticketId =
    `FLIBY-${Date.now()}`;

  // QR payload
  const qrData = JSON.stringify({
    ticket_id: ticketId,
    event_id: event.id,
    event_title: event.title,
    user_email: user.email,
  });

  // Generate QR image
  const qrCodeImage =
    await QRCode.toDataURL(qrData);

  const total =
    event.price === 'Free'
      ? 'Free'
      : event.price;

  const { error } =
  await supabase
    .from('registrations')
    .insert([
      {
        user_email: user.email,

        user_name:
          user.user_metadata?.full_name || user.email,

        user_id: user.id,

        event_id: event.id,

        event_title:
          event.title,

        event_image:
          event.image,

        event_date:
          event.date,

        quantity,

        total,

        ticket_id:
          ticketId,

        qr_code:
          qrCodeImage,
      },
    ]);

  if (error) {

    console.log(error);

    alert(error.message);

    return;
  }

  alert(
    'Successfully registered!'
  );

  setShowTicketModal(false);
};

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div>

      <Navbar />

      <div className="eventDetailsPage">

        <img
          src={event.image}
          alt={event.title}
          className="detailsBanner"
        />

        <div className="detailsContent">

<div className="detailsLeft">

  <div className="detailsTopRow">

    <h1 className="detailsTitle">
      {event.title}
    </h1>

    <p className="detailsCategory">
      {event.category}
    </p>

  </div>

         <div className="hostSection">

  <img
    src={
      event.profile_image ||
      '/default-profile.png'
    }
    alt={event.host_name}
    className="hostImage"
  />

  <div>

    <p className="hostedBy">
      Hosted by
    </p>

    <h3>
      {event.host_name}
    </h3>

  </div>

</div>

            <div className="detailsInfo">

              <p>
                {formatDate(event.date)}
              </p>

              <p className="detailsPlace">
                {event.place} | {event.state}
              </p>
                
                
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(event.place)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="320"
                style={{
                  border: 0,
                  borderRadius: '20px',
                }}
                loading="lazy"
              ></iframe>

                <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.place)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mapButton"
              >
                View Location
              </a>



            </div>

            <div className="detailsDescription">

  <h2>
    About this event
  </h2>

  <p>
    {event.description}
  </p>

  {event.benefits?.length > 0 && (

    <div className="eventBenefits">

      <h3>
        Event Benefits
      </h3>

      <div className="benefitList">

        {event.benefits.map(
          (benefit, index) => (

          <div
            key={index}
            className="benefitItem"
          >
            ✓ {benefit}
          </div>

        ))}

      </div>

    </div>

  )}

</div>

          </div>

          <div className="detailsRight">

            <div className="ticketBox">

              <h2>
                {event.price}
              </h2>

              <button
                onClick={() =>
                  setShowTicketModal(true)
                }
              >
                Reserve a spot
              </button>

            </div>

          </div>

        </div>

      </div>

      {showTicketModal && (

        <div className="ticketOverlay">

          <div className="ticketModal">

            <button
              className="closeTicket"
              onClick={() =>
                setShowTicketModal(false)
              }
            >
              ×
            </button>

            <div className="ticketLeft">

              <h2>
                {event.title}
              </h2>

              <p>
                 {formatDate(event.date)}
              </p>

              <div className="ticketCard">

                <div>

                  <h3>
                    General Admission
                  </h3>

                  <p>
                    {event.price}
                  </p>

                </div>

                <div className="quantityBox">

                  <button
                    onClick={() =>
                      setQuantity(
                        quantity > 1
                          ? quantity - 1
                          : 1
                      )
                    }
                  >
                    -
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity(
                        quantity + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

            <div className="ticketRight">

              <img
                src={event.image}
                alt={event.title}
              />

              <h3>
                Order Summary
              </h3>

              <div className="summaryRow">

                <span>
                  {quantity} x Ticket
                </span>

                <span>
                  {event.price}
                </span>

              </div>

              <h2>
                Total:
                {' '}
                {event.price}
              </h2>

              <button
                className="registerTicketBtn"
                onClick={() => {

                if (event.price === 'Free') {

                  handleReserveSpot();

                } else {

                  window.location.href =
                    `/payment?title=${encodeURIComponent(event.title)}&image=${encodeURIComponent(event.image)}&price=${encodeURIComponent(event.price)}&quantity=${quantity}&eventId=${event.id}`;
                }
              }}
              >
                Register
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}