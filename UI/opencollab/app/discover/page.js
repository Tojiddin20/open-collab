'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSprings, animated, to } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { Toaster, toast } from 'sonner';

// Define the initial state
const initialState = {
    x: 0,
    y: 0,
    rot: 0,
};

// Define the Deck component
const Deck = () => {
    const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
    const [cards, setCards] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    function sendSwipeInfo(approve, projectId) {
        fetch(`http://localhost:5005/projects/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId: projectId,
                userId: JSON.parse(parseInt(localStorage.getItem('token'))),
                approve: approve,
            }),
        }).then((result) => {
            if (result.status === 200) {
                toast.success("Successfully swiped");

                setTimeout(() => {
                    window.location.reload();
                }, 300);

            } else {
                toast.error("Failed to swipe");
            }
        })
    }

    function handleSwipe(dir, projectId) {
        if (dir == 1) {
            toast.message("swiped right");
            sendSwipeInfo(true, projectId)
        } else {
            toast.message("swiped left");
            sendSwipeInfo(false, projectId)
        }
    }


    async function getCardData() {
        let result = await fetch(`http://localhost:5005/projects/discover`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: JSON.parse(parseInt(localStorage.getItem('token'))),
            }),
        })

        if (result.status === 200) {
            let json = await result.json();
            console.log(json);
            // clear the cards first
            setCards([]);
            setCards([json]);
        } else if (result.status == 204) {
            toast.success("Wow, you're all caught up!");
            setEmpty(true)
        }
        else {
            toast.error("Failed to fetch cards");
            toast.error(result.status)
        }

        setIsLoaded(true);
        setShouldFetch(false);
    }

    useEffect(() => {
        // Fetch project data based on projectId from your API
        getCardData();
    }, [shouldFetch]);


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
            handleSwipe(dir, cards[0].id);
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
            <Toaster richColors={true} />
            {isLoaded && !empty ? (
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
                                            src={`http://localhost:5005/${cards[0].imagePath}`}
                                            alt="Project Banner"
                                            className="w-full mb-4 rounded-lg select-none"
                                            draggable="false"
                                            dragstart="false"
                                        />
                                        <h2 className="text-xl font-bold mb-2">{cards[0].name}</h2>
                                        <p className="text-gray-700 mb-4">{cards[0].creatorName}</p>
                                        <p className="text-gray-800">{cards[0].description}</p>
                                    </div>
                                </div>
                            </animated.div>
                        </animated.div>
                    ))}
                </div>
            ) :
                empty ? (
                    <div className="mt-44 flex justify-center">
                    <div>
                        <h1 className="font-bold text-5xl">You're all caught up 🎉!</h1>
                        <Link className="mt-4 flex justify-center  p-2 bg-sky-400 rounded-md text-white font-bold" href="/project/matched">Go to matched 🤩</Link>
                    </div>
                    </div>
                ) : (
                    <div className="animate-pulse flex flex-col items-center justify-center min-h-screen bg-gray-100">
                        <div className="w-1/2 h-12 bg-gray-300 rounded mb-4"></div>
                        <div className="w-3/4 h-32 bg-gray-300 rounded mb-4"></div>
                        <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
                    </div>
                )
            }
        </div>
    );
};

export default Deck;


