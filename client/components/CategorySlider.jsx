'use client';

import { useRouter }
from 'next/navigation';

const categories = [

  {
    name: 'Technology',
    image: '/technology.png',
  },

  {
    name: 'Business',
    image: '/business.png',
  },

  {
    name: 'AI',
    image: '/ai.png',
  },

  {
    name: 'Design',
    image: '/design.png',
  },

  {
    name: 'Workshop',
    image: '/workshop.png',
  },

  {
    name: 'Marketing',
    image: '/marketing.png',
  },

  {
    name: 'Startup',
    image: '/startup.png',
  },

  {
    name: 'Network',
    image: '/network.png',
  },

];

const CategorySlider = () => {

  const router = useRouter();

  return (

    <div className="categorySection">

      <button className="categoryArrow">
        {'<'}
      </button>

      <div className="categories">

        {categories.map((cat, index) => (

          <div
            key={index}
            className="categoryItem"
            onClick={() =>
              router.push(
                `/search?q=${cat.name}`
              )
            }
          >

            <div className="circle">

              <img
                src={cat.image}
                alt={cat.name}
              />

            </div>

            <p>
              {cat.name}
            </p>

          </div>

        ))}

      </div>

      <button className="categoryArrow">
        {'>'}
      </button>

    </div>

  );
};

export default CategorySlider;