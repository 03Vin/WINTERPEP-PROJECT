const mongoose = require('mongoose');
const Resource = require('./models/Resource');
require('dotenv').config();

const resources = [
    // INT656 - Advanced Web Dev
    {
        subjectId: 'INT656',
        title: 'Advanced React Architecture (Meta)',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=k_y97Z-y0Wk',
        size: '45:10 min',
        category: 'Video',
        provider: 'Meta Developers',
        topics: ['101', '104']
    },
    {
        subjectId: 'INT656',
        title: 'Mastering Next.js 15 App Router',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=W0SADL7Mv_I',
        size: '1:12 hr',
        category: 'Video',
        provider: 'JavaScript Mastery',
        topics: ['101']
    },
    {
        subjectId: 'INT656',
        title: 'Full Stack MERN Design Systems',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=lA_N7x6m8yQ',
        size: '52:30 min',
        category: 'Video',
        provider: 'Code with Antonio',
        topics: ['102']
    },
    {
        subjectId: 'INT656',
        title: 'Modern Portfolio Architecture',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=B0S_gN0r1cM',
        size: '38:15 min',
        category: 'Video',
        provider: 'Javascript Mastery',
        topics: ['104']
    },

    // INT545 - ReactJS
    {
        subjectId: 'INT545',
        title: 'Complete React Hooks Reference',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=mJvYx52e00M',
        size: '28:40 min',
        category: 'Video',
        provider: 'PedroTech',
        topics: ['201']
    },
    {
        subjectId: 'INT545',
        title: 'Every React Hook Explained (2025)',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=xfKYYRE6-TQ',
        size: '35:20 min',
        category: 'Video',
        provider: 'Cosden Solutions',
        topics: ['201', '202']
    },
    {
        subjectId: 'INT545',
        title: 'React 19 & Custom Hooks',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=w01Rz0l6VbY',
        size: '22:15 min',
        category: 'Video',
        provider: 'Lama Dev',
        topics: ['202']
    },
    {
        subjectId: 'INT545',
        title: 'React Router v7 Crash Course',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=f-Kuxy79LNY',
        size: '15:10 min',
        category: 'Video',
        provider: 'The Net Ninja',
        topics: ['203']
    },

    // PEA333 - Analytical Skills
    {
        subjectId: 'PEA333',
        title: 'Data Interpretation Master Class',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=mD0iV4_FhQ8',
        size: '42:10 min',
        category: 'Video',
        provider: 'Career Definer',
        topics: ['303']
    },
    {
        subjectId: 'PEA333',
        title: 'DI Revision for Placement',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=0hX0I4i7a8w',
        size: '1:05 hr',
        category: 'Video',
        provider: 'Top Ranked',
        topics: ['303']
    },
    {
        subjectId: 'PEA333',
        title: 'Algebra Foundations for Quant',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=NybHckSEQBI',
        size: '18:40 min',
        category: 'Video',
        provider: 'Math Antics',
        topics: ['301']
    },
    {
        subjectId: 'PEA333',
        title: 'Logical Reasoning Puzzles',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=1F_47B-nJj8',
        size: '25:20 min',
        category: 'Video',
        provider: 'Aptitude Hub',
        topics: ['302']
    },

    // MTH290 - Probability
    {
        subjectId: 'MTH290',
        title: 'Probability Theory Overview',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=Vz2mhkW4Hws',
        size: '24:15 min',
        category: 'Video',
        provider: 'Great Learning',
        topics: ['401']
    },
    {
        subjectId: 'MTH290',
        title: 'Statistics for Data Science',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=s5RMY663L7Q',
        size: '1:02 hr',
        category: 'Video',
        provider: 'Simplilearn',
        topics: ['401']
    },
    {
        subjectId: 'MTH290',
        title: 'Probability Formulas & Logic',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=pYxS4t-8FqQ',
        size: '15:20 min',
        category: 'Video',
        provider: 'Mario\'s Math Tutoring',
        topics: ['402']
    },
    {
        subjectId: 'MTH290',
        title: 'Inferential Stat & Hypothesis',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=jW2f1D_tF60',
        size: '18:40 min',
        category: 'Video',
        provider: 'Statistics Fun',
        topics: ['403']
    },

    // CSE202 - C++
    {
        subjectId: 'CSE202',
        title: 'C++ STL Master Tutorial',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=vVj4xO_q-zM',
        size: '35:10 min',
        category: 'Video',
        provider: 'Coding Blocks',
        topics: ['503']
    },
    {
        subjectId: 'CSE202',
        title: 'STL: Ultimate Container Guide',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=yYn4Q_pM-10',
        size: '22:15 min',
        category: 'Video',
        provider: 'Luv',
        topics: ['503']
    },
    {
        subjectId: 'CSE202',
        title: 'C++ Classes & Objects (Intro)',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=qsjN_0eW9i4',
        size: '18:20 min',
        category: 'Video',
        provider: 'Simplilearn',
        topics: ['501']
    },
    {
        subjectId: 'CSE202',
        title: 'Pointers Demystified (15m)',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=dtp8pD7B-gY',
        size: '15:00 min',
        category: 'Video',
        provider: 'Portfolio Courses',
        topics: ['502']
    },

    // CSE205 - DSA
    {
        subjectId: 'CSE205',
        title: 'DSA Mega Course (Beginner to Pro)',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=5_5oE5lgrhw',
        size: '49:12 hr',
        category: 'Video',
        provider: 'MyCodeSchool',
        topics: ['601', '602']
    },
    {
        subjectId: 'CSE205',
        title: 'Graph Theory Foundations',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=t2CEgPsws3U',
        size: '2:15 hr',
        category: 'Video',
        provider: 'freeCodeCamp',
        topics: ['603']
    },
    {
        subjectId: 'CSE205',
        title: 'Solve DP like a Senior Dev',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=oBt53YbR9Kk',
        size: '3:10 hr',
        category: 'Video',
        provider: 'freeCodeCamp',
        topics: ['604']
    },
    {
        subjectId: 'CSE205',
        title: 'Data Structures Full Course',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=pkVa7d1j0-8',
        size: '8:05 hr',
        category: 'Video',
        provider: 'freeCodeCamp',
        topics: ['601', '602']
    },

    // CSE306 - Networking
    {
        subjectId: 'CSE306',
        title: 'TCP/IP Made Super Easy',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=pV-l4C6V43U',
        size: '22:15 min',
        category: 'Video',
        provider: 'PowerCert Design',
        topics: ['701']
    },
    {
        subjectId: 'CSE306',
        title: 'Routing Protocols Deep Dive',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=1F0_a3u1Jk4',
        size: '18:40 min',
        category: 'Video',
        provider: 'Sunny Classroom',
        topics: ['703']
    },
    {
        subjectId: 'CSE306',
        title: 'OSI Model Crash Course',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=vL_7dZJ5268',
        size: '15:20 min',
        category: 'Video',
        provider: 'Practical Networking',
        topics: ['701']
    },
    {
        subjectId: 'CSE306',
        title: 'Network Security Fundamentals',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=U_P2vR9V9os',
        size: '14:20 min',
        category: 'Video',
        provider: 'Eli the Computer Guy',
        topics: ['704']
    },

    // PEL136 - Communication
    {
        subjectId: 'PEL136',
        title: '7 Public Speaking Tips',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=w01Rz0l6VbM',
        size: '12:15 min',
        category: 'Video',
        provider: 'Science of People',
        topics: ['803']
    },
    {
        subjectId: 'PEL136',
        title: 'Top 5 Communication Skills',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=H74_B77B_h4',
        size: '10:40 min',
        category: 'Video',
        provider: 'Alex Lyon',
        topics: ['801']
    },
    {
        subjectId: 'PEL136',
        title: 'Professional Comm for Experts',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=WESGDi_ajUU',
        size: '15:20 min',
        category: 'Video',
        provider: 'Simo Ahava',
        topics: ['802']
    },
    {
        subjectId: 'PEL136',
        title: 'Mastering Public Speaking',
        type: 'Video',
        url: 'https://www.youtube.com/watch?v=V8eLdbKXGzk',
        size: '18:40 min',
        category: 'Video',
        provider: 'Vinh Giang',
        topics: ['803']
    }
];

async function seed() {
    try {
        console.log('⏳ Connecting to AIvent Database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🧹 Clearing Legacy Resources...');
        await Resource.deleteMany({});
        console.log(`🌱 Planting Diversity: ${resources.length} Unique Academic Assets...`);

        // Final duplicate check
        const urls = new Set();
        const finalResources = resources.filter(r => {
            if (urls.has(r.url)) return false;
            urls.add(r.url);
            return true;
        });

        await Resource.insertMany(finalResources);
        console.log(`✅ LMS Library Seeded: ${finalResources.length} Guaranteed Unique Assets!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding Failed:', err);
        process.exit(1);
    }
}

seed();
