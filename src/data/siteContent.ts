
export const siteContent = {
    hero: {
        title: "Robust Automation & Embedded Systems",
        subtitle: "Engineering solutions for the modern world. Experts in industrial automation, embedded systems, and prototyping.",
        images: [
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070", // Industrial Machine (Verified)
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070", // Electronics (Verified)
            "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=2070", // Machinery (Verified)
            "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=2070", // Automation (Verified)
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070", // Green Tech (Verified)
        ]
    },
    services: {
        introTitle: "Our Expertise",
        introText: "We provide comprehensive engineering services tailored to your needs.",
        cards: [
            {
                title: "Embedded Systems",
                description: "Custom hardware and firmware development for IoT, industrial, and consumer applications."
            },
            {
                title: "Industrial Automation",
                description: "PLC programming, SCADA systems, and process optimization for manufacturing efficiency."
            },
            {
                title: "Prototyping & Production",
                description: "From proof-of-concept to volume manufacturing, we guide you through the entire product lifecycle."
            }
        ]
    },
    mission: {
        mainTitle: "Our Mission",
        subTitle: "Driven by Innovation, Grounded in Reliability",
        introParagraph: "At Robust AE, we believe in building systems that last. Our engineering philosophy centers on creating robust, scalable, and maintainable solutions that drive value for our clients.",
        points: [
            { title: "Quality First", text: "We never compromise on the quality of our code or hardware designs." },
            { title: "Client Partnership", text: "We work closely with you to truly understand your problems and goals." },
            { title: "Future Proofing", text: "Designing with modularity and scalability in mind to adapt to future needs." }
        ]
    },
    skills: {
        hardware: [
            { name: 'Embedded Systems Design' },
            { name: 'PCB Design & Layout' },
            { name: 'Circuit Design' },
            { name: 'Signal Integrity' },
            { name: 'Prototyping' }
        ],
        software: [
            { name: 'Embedded C/C++' },
            { name: 'RTOS Implementation' },
            { name: 'Python Scripting' },
            { name: 'Firmware Development' },
            { name: 'HMI & UI Development' }
        ],
        tools: [
            { name: 'Eagle/KiCad/Altium' },
            { name: 'CAD (SolidWorks, Fusion360)' },
            { name: 'I2C, SPI, UART, CAN' },
            { name: 'Git/Version Control' },
            { name: 'Oscilloscopes & Logic Analyzers' }
        ],
        certifications: [
            {
                title: 'BEng in Electrical & Electronic Engineering',
                organization: 'University of Manchester',
                id: '2015-2018'
            },
            {
                title: 'NAPIT Certified Electrical Engineer',
                organization: 'NAPIT',
                id: '60482'
            },
            {
                title: 'IET Member',
                organization: 'IET',
                id: '1100789092'
            }
        ]
    },
    projects: {
        items: [
            {
                title: 'Industrial Control System',
                description: 'A comprehensive control system for manufacturing equipment, featuring real-time monitoring, predictive maintenance algorithms, and integration with existing factory systems.',
                technologies: ['PLC', 'SCADA', 'HMI Design', 'ModBus'],
                imageSrc: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=1000',
                challenge: "The primary challenge was to integrate a legacy manufacturing line with modern IoT capabilities for real-time data acquisition and predictive maintenance without significant downtime.",
                solution: "We developed a custom PLC program and SCADA interface, coupled with edge computing devices to gather sensor data. This data was then streamed to a cloud platform for analysis and dashboarding.",
                results: "Achieved a 15% reduction in unplanned downtime and a 10% increase in overall equipment effectiveness (OEE) within the first six months.",
                additionalImages: [
                    { src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800", alt: "ICS Detail 1" },
                    { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", alt: "ICS Detail 2" }
                ],
                testimonial: {
                    quote: "Robust AE's solution for our control system has been a game-changer. The insights we get now are invaluable.",
                    name: "John Doe",
                    position: "Plant Manager",
                    company: "Manufacturing Co."
                }
            },
            {
                title: 'Smart Environmental Monitor',
                description: 'A low-power IoT device for environmental monitoring in industrial settings. Features wireless connectivity, multiple sensor inputs, and cloud-based data analytics with alert capabilities.',
                technologies: ['Custom PCB', 'ESP32', 'MQTT', 'Low Power Design'],
                imageSrc: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
                challenge: "Designing a device that could operate for extended periods on battery power in harsh industrial environments while reliably transmitting data from multiple sensors.",
                solution: "A custom-designed PCB with an ESP32 microcontroller, optimized for low-power consumption. Firmware was developed to manage sensor readings, data transmission via MQTT, and sleep cycles effectively.",
                results: "The device achieved over 12 months of battery life on a single charge while providing critical environmental data, leading to improved safety and regulatory compliance.",
                additionalImages: [
                    { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", alt: "Env Monitor Detail 1" },
                    { src: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800", alt: "Env Monitor Detail 2" }
                ],
                testimonial: {
                    quote: "The smart environmental monitors from Robust AE have significantly improved our ability to track conditions in remote locations.",
                    name: "Jane Smith",
                    position: "Compliance Officer",
                    company: "EcoLogistics Ltd."
                }
            },
            {
                title: 'Precision Motor Controller',
                description: 'A high-performance motor control system with closed-loop feedback. Features customizable PID parameters, torque and position control, and comprehensive safety features for industrial applications.',
                technologies: ['STM32', 'FOC Algorithm', 'Real-time Control', 'CAN Interface'],
                imageSrc: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=1000',
                challenge: "Achieving sub-millisecond response times for motor control adjustments and ensuring high precision in a noisy industrial environment with fluctuating loads.",
                solution: "An STM32-based controller implementing a Field-Oriented Control (FOC) algorithm. Advanced filtering and a robust CAN interface were used for reliable communication and control.",
                results: "The controller delivered a 30% improvement in positioning accuracy and a 50% reduction in motor vibration, enhancing product quality in the client's automated assembly line.",
                additionalImages: [
                    { src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800", alt: "Motor Controller Detail 1" },
                    { src: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800", alt: "Motor Controller Detail 2" }
                ],
                testimonial: {
                    quote: "The precision motor controller developed by Robust AE is the most stable and responsive we've ever used.",
                    name: "Alex Chan",
                    position: "Lead Robotics Engineer",
                    company: "Automata Inc."
                }
            }
        ]
    },
    testimonials: {
        items: [
            {
                quote: "Robust AE provided updates to our industrial control system. The team demonstrated knowledge in embedded systems and delivered a functional solution.",
                name: "Sarah Johnson",
                position: "CTO",
                company: "MaxTech Industries",
                initials: "SJ",
                imageSrc: "/images/client-face-pics/sarah.jpg"
            },
            {
                quote: "George and his team completed the hardware and software development tasks. They resolved the assigned technical issues in a satisfactory manner.",
                name: "Michael Chen",
                position: "Engineering Director",
                company: "Nexus Automation",
                initials: "MC",
                imageSrc: "/images/client-face-pics/Michael.jpg"
            },
            {
                quote: "We collaborated with Robust AE on an IoT platform. The project was completed according to the timeline and communication was consistent.",
                name: "David Rodriguez",
                position: "Product Manager",
                company: "SmartSys Solutions",
                initials: "DR",
                imageSrc: "/images/client-face-pics/david.jpg"
            },
            {
                quote: "The guidance system component was delivered on time. The integration with our target algorithms met the functional requirements and budget constraints.",
                name: "Emma Wilson",
                position: "Operations Director",
                company: "Altitude Systems",
                initials: "EW",
                imageSrc: "/images/client-face-pics/emma.jpg"
            }
        ],
        clients: [
            { name: "Altitude Systems", logoSrc: "/images/client-logos/AltitudeSystems.png" },
            { name: "CoreTech Solutions", logoSrc: "/images/client-logos/CoreTechSolutions.png" },
            { name: "FutureTech Labs", logoSrc: "/images/client-logos/FutureTechLabs.png" },
            { name: "InnovateSys Group", logoSrc: "/images/client-logos/InnovateSysGroup.png" },
            { name: "MaxTech Industries", logoSrc: "/images/client-logos/maxtech.png" },
            { name: "MediTech Innovations", logoSrc: "/images/client-logos/MediTechInnovations.png" },
            { name: "Nexus Automation", logoSrc: "/images/client-logos/nexusautomation.png" },
            { name: "Quantum Dynamics", logoSrc: "/images/client-logos/QuantumDynamics.png" },
            { name: "SmartSys Solutions", logoSrc: "/images/client-logos/SmartSysSolutions.png" },
            { name: "TechnoVista Inc", logoSrc: "/images/client-logos/TechnoVsitaInc.png" }
        ]
    },
    contact: {
        title: "Get In Touch",
        text: "Ready to start your next project? Contact us today for a consultation.",
        cvUrl: "/George_Haworth_CV.pdf"
    }
};
