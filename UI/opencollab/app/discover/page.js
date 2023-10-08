'use client'

// Import necessary modules from 'react'
import { useState } from 'react';
import { useSprings, animated, interpolate } from 'react-spring';
import { useDrag } from 'react-use-gesture';

// Define the cards array
const cards = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Barack_Obama_with_artistic_gymnastic_McKayla_Maroney_2.jpg/1024px-Barack_Obama_with_artistic_gymnastic_McKayla_Maroney_2.jpg',
];

// Define the initial state
const initialState = {
  x: 0,
  y: 0,
  rot: 0,
};

// Define the Deck component
const Deck = () => {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out

  const [springs, set] = useSprings(cards.length, (i) => ({
    from: initialState,
    ...initialState,
  }));

  const bindGesture = useDrag(({ args: [index], down, movement: [deltaX, deltaY], distance, velocity }) => {
    const trigger = velocity > 0.2 || Math.abs(deltaX) > 100;
    const dir = deltaX > 0 ? 1 : -1;
    if (!down && trigger) gone.add(index);

    set((i) => {
      if (index !== i) return;
      const isGone = gone.has(index);

      const x = isGone ? (200 + window.innerWidth) * dir : down ? deltaX : 0;
      const y = down ? deltaY : 0;
      const rot = down ? deltaX / 10 + (isGone ? dir * 10 * velocity : 0) : 0;
      const config = {
        friction: 50,
        tension: down ? 800 : isGone ? 200 : 500,
        clamp: down,
      };

      return { x, y, rot, config };
    });
  });

  return (
    <div>
      {springs.map(({ x, y, rot }, i) => (
        <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
          <animated.div
            {...bindGesture(i)}
            style={{
              transform: interpolate([rot], (rot) => `rotateX(30deg) rotateY(${rot / 10}deg) rotateZ(${rot}deg)`),
              backgroundImage: `url(${cards[i]})`,
              width: '200px',
              height: '300px', // Adjust card size as needed
            }}
          />
        </animated.div>
      ))}
    </div>
  );
};

export default Deck;

