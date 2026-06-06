'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';

import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

function PaymentContent() {

  const searchParams = useSearchParams();

  const eventId =
    searchParams.get('eventId');

  const title =
    searchParams.get('title');

  const image =
    searchParams.get('image');

  const price =
    searchParams.get('price');

  const quantity =
    searchParams.get('quantity') || 1;

  // KEEP ALL YOUR EXISTING CODE HERE


  const total =
    price === 'Free'
      ? 'Free'
      : `RM${
          parseInt(
            price.replace('RM', '')
          ) * quantity
        }`;

  const [
    selectedPayment,
    setSelectedPayment,
  ] = useState('atome');

const handlePayment = async () => {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {

    alert('Please login first');

    return;
  }

  const ticketId =
    `FLIBY-${Date.now()}`;

  const qrData = JSON.stringify({
    ticket_id: ticketId,
    event_id: eventId,
    event_title: title,
    user_email: user.email,
  });

  const qrCodeImage =
    await QRCode.toDataURL(qrData);

  const { error } =
    await supabase
      .from('registrations')
      .insert([
        {
          event_id: eventId,

          user_email: user.email,

          event_title: title,

          event_image: image,

          quantity,

          total,

          ticket_id: ticketId,

          qr_code: qrCodeImage,
        },
      ]);

  if (error) {

    console.log(error);

    alert('Payment failed');

    return;
  }

  alert(
    'You have successfully paid for this event!'
  );

  window.location.href =
    `/event/${eventId}`;
};


  return (
    <div>

      <Navbar />

      <div className="paymentPage">

        <div className="paymentContainer">

          <div className="paymentLeft">

            <h1 className="paymentTitle">
              CHECKOUT
            </h1>

            <div className="paymentFormBox">

              <h2>
                CONTACT
              </h2>

              <input
                type="email"
                placeholder="Your email address"
              />

              <h2>
                DELIVERY ADDRESS
              </h2>

              <div className="paymentRow">

                <input
                  type="text"
                  placeholder="First Name"
                />

                <input
                  type="text"
                  placeholder="Last Name"
                />

              </div>

              <input
                type="text"
                placeholder="Country"
              />

              <input
                type="text"
                placeholder="Address"
              />

              <div className="paymentRow">

                <input
                  type="text"
                  placeholder="Town"
                />

                <input
                  type="text"
                  placeholder="State"
                />

                <input
                  type="text"
                  placeholder="Postcode"
                />

              </div>

              <div className="paymentMethods">

                <h2 className="paymentHeader">
                  Payment
                </h2>

                <p className="paymentSubtext">
                  All transactions are secure
                  and encrypted.
                </p>

                <div
                  className={`paymentOption ${
                    selectedPayment ===
                    'atome'
                      ? 'activePayment'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedPayment(
                      'atome'
                    )
                  }
                >

                  <div className="paymentTop">

                    <div className="paymentLeftOption">

                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={
                          selectedPayment ===
                          'atome'
                        }
                        readOnly
                      />

                      <span>
                        Atome PayLater - 3
                        easy payments, 0%
                        interest
                      </span>

                    </div>

                    <div className="paymentIcons">

                      <img src="/visa.png" />

                      <img src="/mastercard.png" />

                      <img src="/amex.png" />

                    </div>

                  </div>

                  {selectedPayment ===
                    'atome' && (

                    <div className="paymentDescription">

                      You'll be redirected
                      to Atome PayLater to
                      complete your
                      purchase.

                    </div>

                  )}

                </div>

                <div
                  className={`paymentOption ${
                    selectedPayment ===
                    'fiuu'
                      ? 'activePayment'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedPayment(
                      'fiuu'
                    )
                  }
                >

                  <div className="paymentTop">

                    <div className="paymentLeftOption">

                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={
                          selectedPayment ===
                          'fiuu'
                        }
                        readOnly
                      />

                      <span>
                        Fast Payment with
                        Fiuu
                      </span>

                    </div>

                    <div className="paymentIcons">

                      <img src="/visa.png" />

                      <img src="/mastercard.png" />

                      <img src="/amex.png" />

                    </div>

                  </div>

                  {selectedPayment ===
                    'fiuu' && (

                    <div className="paymentDescription">

                      You'll be redirected
                      to Fiuu secure
                      checkout to complete
                      your payment.

                    </div>

                  )}

                </div>

              </div>

            <button
              className="paymentBtn"
              onClick={handlePayment}
            >
              Complete Payment
            </button>

            </div>

          </div>

          <div className="paymentRight">

            <h2 className="detailTitle">
              EVENT DETAILS
            </h2>

            <div className="paymentEventCard">

              <img
                src={image}
                alt={title}
              />

              <div className="paymentEventInfo">

                <h3>
                  {title}
                </h3>

                <p>
                  {quantity} x Ticket
                </p>

              </div>

              <h2>
                {price}
              </h2>

            </div>

            <div className="paymentSummary">

              <div className="summaryLine">

                <h3>
                  TOTAL
                </h3>

                <h3>
                  {total}
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentContent />
    </Suspense>
  );
}

