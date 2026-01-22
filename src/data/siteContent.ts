
export const siteContent = {
    hero: {
        title: "Robust Automation & Embedded Systems",
        subtitle: "Engineering solutions for the modern world. Experts in industrial automation, embedded systems, and prototyping."
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
                imageSrc: '/images/projects/Industrial_Control_System.jpg',
                challenge: "The primary challenge was to integrate a legacy manufacturing line with modern IoT capabilities for real-time data acquisition and predictive maintenance without significant downtime.",
                solution: "We developed a custom PLC program and SCADA interface, coupled with edge computing devices to gather sensor data. This data was then streamed to a cloud platform for analysis and dashboarding.",
                results: "Achieved a 15% reduction in unplanned downtime and a 10% increase in overall equipment effectiveness (OEE) within the first six months.",
                additionalImages: [
                    { src: "/images/projects/industrial-detail-1.jpg", alt: "ICS Detail 1" },
                    { src: "/images/projects/industrial-detail-2.jpg", alt: "ICS Detail 2" }
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
                imageSrc: '/images/projects/Smart_Environmental_Monitor.jpg',
                challenge: "Designing a device that could operate for extended periods on battery power in harsh industrial environments while reliably transmitting data from multiple sensors.",
                solution: "A custom-designed PCB with an ESP32 microcontroller, optimized for low-power consumption. Firmware was developed to manage sensor readings, data transmission via MQTT, and sleep cycles effectively.",
                results: "The device achieved over 12 months of battery life on a single charge while providing critical environmental data, leading to improved safety and regulatory compliance.",
                additionalImages: [
                    { src: "/images/projects/env-monitor-detail-1.jpg", alt: "Env Monitor Detail 1" },
                    { src: "/images/projects/env-monitor-detail-2.jpg", alt: "Env Monitor Detail 2" }
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
                imageSrc: '/images/projects/Precision_Motor_Controller.jpg',
                challenge: "Achieving sub-millisecond response times for motor control adjustments and ensuring high precision in a noisy industrial environment with fluctuating loads.",
                solution: "An STM32-based controller implementing a Field-Oriented Control (FOC) algorithm. Advanced filtering and a robust CAN interface were used for reliable communication and control.",
                results: "The controller delivered a 30% improvement in positioning accuracy and a 50% reduction in motor vibration, enhancing product quality in the client's automated assembly line.",
                additionalImages: [
                    { src: "/images/projects/motor-controller-detail-1.jpg", alt: "Motor Controller Detail 1" },
                    { src: "/images/projects/motor-controller-detail-2.jpg", alt: "Motor Controller Detail 2" }
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
                quote: "Robust AE transformed our industrial control system. Their embedded expertise and dedication to quality delivered a solution that exceeded our expectations and revolutionized our manufacturing processes.",
                name: "Sarah Johnson",
                position: "CTO",
                company: "MaxTech Industries",
                initials: "SJ",
                imageSrc: "/images/client-face-pics/sarah.jpg"
            },
            {
                quote: "George did a great job leading the Robust AE team. His deep knowledge of both hardware and software development allowed them to solve problems other firms couldn't.",
                name: "Michael Chen",
                position: "Engineering Director",
                company: "Nexus Automation",
                initials: "MC",
                imageSrc: "/images/client-face-pics/Michael.jpg"
            },
            {
                quote: "Working with George and the Robust AE team on our IoT platform was a game-changer. Their technical expertise and reliable communication made the project seamless.",
                name: "David Rodriguez",
                position: "Product Manager",
                company: "SmartSys Solutions",
                initials: "DR",
                imageSrc: "/images/client-face-pics/david.jpg"
            },
            {
                quote: "George delivered our Nuclear Aeronautical Submarine Laser Guidance System on time and within budget. His ability to integrate quantum entanglement with hypersonic targeting algorithms while underwater was simply extraordinary.",
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
        text: "Ready to start your next project? Contact us today for a consultation."
    }
};
