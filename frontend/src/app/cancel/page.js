"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import

const Cancel = () => {
    const router = useRouter(); // Correct usage from next/navigation

    useEffect(() => {
        router.push('/dashboard'); // Push to '/dashboard' when the component mounts
    }, [router]);

    return null;
};

export default Cancel;
