
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        darkBg: '#050505',
                        darkCard: '#111111',
                        darkBorder: '#222222',
                        lightBg: '#FAFAFA',
                        lightCard: '#FFFFFF',
                        lightBorder: '#E5E7EB',
                        accent: '#FDB813',
                        accentHover: '#E5A000',
                    },
                    fontFamily: {
                        heading: ['Outfit', 'sans-serif'],
                        body: ['Plus Jakarta Sans', 'sans-serif'],
                    },
                    animation: {
                        'marquee': 'marquee 25s linear infinite',
                        'spin-slow': 'spin 8s linear infinite',
                    },
                    keyframes: {
                        marquee: {
                            '0%': { transform: 'translateX(0%)' },
                            '100%': { transform: 'translateX(-50%)' },
                        }
                    }
                }
            }
        }
    
