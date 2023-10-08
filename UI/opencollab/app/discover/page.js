'use client'

import { useEffect, useState } from 'react';
import { useSprings, animated, to } from 'react-spring';
import { useDrag } from 'react-use-gesture';

// Define the initial state
const initialState = {
    x: 0,
    y: 0,
    rot: 0,
};

function handleSwipe(dir) {
    if (dir == 1) {
        console.log("swiped right");
    } else {
        console.log("swiped left");
    }
}

// Define the Deck component
const Deck = () => {
    const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
    const [cards, setCards] = useState([]);

    useEffect(() => {
        // Fetch project data based on projectId from your API
        fetch(`http://localhost:5005/projects`)
            .then((response) => response.json())
            .then((data) => setCards(data))
            .catch((error) => console.log(error));
    }, []);


    const [springs, set] = useSprings(cards.length, (i) => ({
        from: initialState,
        ...initialState,
    }));

    const bindGesture = useDrag(({ args: [index], down, movement: [deltaX, deltaY], distance, velocity }) => {
        const trigger = velocity > 0.2 || Math.abs(deltaX) > 100;
        const dir = deltaX > 0 ? 1 : -1;
        if (!down && trigger) {
            gone.add(index);

            console.log(dir);
            handleSwipe(dir);
        }

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
        <div className="flex justify-center">
            <div className="w-1/2 h-full select-none bg-red-400">
                {springs.map(({ x, y, rot }, i) => (
                    <animated.div key={i} style={{ transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
                        <animated.div
                            {...bindGesture(i)}
                            style={{
                                transform: to([rot], (rot) => `rotateX(30deg) rotateY(${rot / 10}deg) rotateZ(${rot}deg)`),
                                backgroundSize: 'cover',
                            }}
                        >
                            <div className="flex justify-center">
                                <div className="w-3/4 bg-white p-8 rounded shadow-lg">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Barack_Obama_with_artistic_gymnastic_McKayla_Maroney_2.jpg/1024px-Barack_Obama_with_artistic_gymnastic_McKayla_Maroney_2.jpg"
                                        alt="Project Banner"
                                        className="w-full mb-4 rounded-lg select-none"
                                        draggable="false"
                                        dragstart="false"
                                    />
                                    <h2 className="text-xl font-bold mb-2">Project Name</h2>
                                    <p className="text-gray-700 mb-4">Creator Name</p>
                                    <p className="text-gray-800">
                                        Project DescriptionLorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                </div>
                            </div>
                        </animated.div>
                    </animated.div>
                ))}
            </div>
        </div>
    );
};

export default Deck;
