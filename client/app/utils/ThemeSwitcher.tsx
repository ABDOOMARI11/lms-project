import React from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { BiMoon, BiSun } from "react-icons/bi";


const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) { return null }

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="flex items-center justify-center mx-4">
            {theme === "light" ? (
                <BiMoon className='cursor-pointer' fill='black' size={25} onClick={toggleTheme} />
                
            ) : (
                <BiSun size={25} className='cursor-pointer' onClick={toggleTheme} />
            )}
        </div>
    );
};

export default ThemeSwitcher;
