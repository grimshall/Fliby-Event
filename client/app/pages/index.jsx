import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategorySlider from '../components/CategorySlider';
import EventList from '../components/EventList';

export default function Home() {
  return (
    <div>
      <Navbar />

      <HeroBanner />

      <CategorySlider />

      <div className="container">
        <h2 className="browseText">
          You're currently browsing in
          <span> Kuala Lumpur</span>
        </h2>

        <EventList />
      </div>
    </div>
  );
}