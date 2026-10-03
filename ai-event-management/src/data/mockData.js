// Mock data for AI Event Management System prototype

export const mockEvents = [
  {
    id: 1,
    name: "AI & Machine Learning Workshop",
    description:
      "An intensive workshop covering the fundamentals of Artificial Intelligence and Machine Learning. Participants will get hands-on experience with real datasets, learn about neural networks, supervised and unsupervised learning, and build their first ML model using Python and scikit-learn.",
    category: "Workshop",
    date: "2026-10-15",
    startTime: "09:00",
    endTime: "17:00",
    venue: "Computer Science Lab, Block A",
    maxParticipants: 60,
    registeredParticipants: 47,
    organizer: "Dr. Priya Sharma",
    status: "Upcoming",
    image: null,
    tags: ["AI", "ML", "Python", "Data Science"],
  },
  {
    id: 2,
    name: "CodeFest 2026",
    description:
      "The annual coding competition where students compete in algorithmic problem solving and software development challenges. Teams of 2–4 compete across multiple rounds to win exciting prizes and internship opportunities from top tech companies.",
    category: "Hackathon",
    date: "2026-10-22",
    startTime: "08:00",
    endTime: "20:00",
    venue: "Main Auditorium",
    maxParticipants: 120,
    registeredParticipants: 98,
    organizer: "Prof. Rajesh Kumar",
    status: "Upcoming",
    image: null,
    tags: ["Coding", "Competition", "Prizes"],
  },
  {
    id: 3,
    name: "Web Development Bootcamp",
    description:
      "A comprehensive two-day bootcamp covering modern web development from HTML/CSS basics to React.js and Node.js. Ideal for beginners and intermediate developers looking to upgrade their skills and build portfolio projects.",
    category: "Workshop",
    date: "2026-11-05",
    startTime: "09:00",
    endTime: "18:00",
    venue: "IT Department Seminar Hall",
    maxParticipants: 50,
    registeredParticipants: 50,
    organizer: "Ms. Ananya Patel",
    status: "Upcoming",
    image: null,
    tags: ["Web Dev", "React", "JavaScript"],
  },
  {
    id: 4,
    name: "College Cultural Fest",
    description:
      "The biggest cultural event of the year featuring music performances, dance competitions, drama, art exhibitions, and food stalls. A celebration of diversity and talent across all departments of the college.",
    category: "Cultural",
    date: "2026-11-18",
    startTime: "10:00",
    endTime: "22:00",
    venue: "College Open Ground",
    maxParticipants: 500,
    registeredParticipants: 312,
    organizer: "Student Council",
    status: "Upcoming",
    image: null,
    tags: ["Music", "Dance", "Art", "Culture"],
  },
  {
    id: 5,
    name: "Hackathon 2026",
    description:
      "A 24-hour innovation hackathon where teams build solutions for real-world problems in healthcare, education, and environment. Mentored by industry professionals with cash prizes up to ₹50,000 for top teams.",
    category: "Hackathon",
    date: "2026-12-01",
    startTime: "09:00",
    endTime: "09:00",
    venue: "Innovation Hub, Block C",
    maxParticipants: 80,
    registeredParticipants: 64,
    organizer: "Dr. Vikram Singh",
    status: "Upcoming",
    image: null,
    tags: ["Innovation", "24-hour", "Cash Prize"],
  },
  {
    id: 6,
    name: "Annual Sports Meet",
    description:
      "The annual inter-department sports competition featuring cricket, football, volleyball, badminton, table tennis, and athletics events. All students are encouraged to participate and represent their departments.",
    category: "Sports",
    date: "2026-09-10",
    startTime: "07:00",
    endTime: "18:00",
    venue: "College Sports Ground",
    maxParticipants: 300,
    registeredParticipants: 300,
    organizer: "Physical Education Dept.",
    status: "Completed",
    image: null,
    tags: ["Sports", "Cricket", "Football", "Athletics"],
  },
  {
    id: 7,
    name: "Cyber Security Seminar",
    description:
      "An expert-led seminar on modern cybersecurity threats, ethical hacking, penetration testing, and best practices for protecting digital assets. Guest speakers from top cybersecurity firms will share real-world case studies.",
    category: "Seminar",
    date: "2026-09-20",
    startTime: "10:00",
    endTime: "16:00",
    venue: "Seminar Hall, Block B",
    maxParticipants: 90,
    registeredParticipants: 87,
    organizer: "Prof. Meena Nair",
    status: "Completed",
    image: null,
    tags: ["Security", "Ethical Hacking", "Cybersecurity"],
  },
  {
    id: 8,
    name: "Entrepreneurship Summit",
    description:
      "Connect with successful entrepreneurs, venture capitalists, and startup founders. This summit features keynote talks, panel discussions, startup pitch competitions, and networking sessions for aspiring student entrepreneurs.",
    category: "Seminar",
    date: "2026-10-08",
    startTime: "09:30",
    endTime: "17:30",
    venue: "Management Block Auditorium",
    maxParticipants: 150,
    registeredParticipants: 134,
    organizer: "E-Cell, College",
    status: "Ongoing",
    image: null,
    tags: ["Startup", "Entrepreneurship", "Networking"],
  },
];

export const mockParticipants = [
  {
    id: 1,
    eventId: 1,
    studentName: "Aditya Rajan",
    email: "aditya.rajan@college.edu",
    registrationDate: "2026-09-25",
    status: "Confirmed",
    rollNo: "CS2021001",
    department: "Computer Science",
    phone: "9876543210",
  },
  {
    id: 2,
    eventId: 1,
    studentName: "Priya Menon",
    email: "priya.menon@college.edu",
    registrationDate: "2026-09-26",
    status: "Confirmed",
    rollNo: "CS2021002",
    department: "Computer Science",
    phone: "9876543211",
  },
  {
    id: 3,
    eventId: 1,
    studentName: "Rohan Desai",
    email: "rohan.desai@college.edu",
    registrationDate: "2026-09-27",
    status: "Confirmed",
    rollNo: "IT2021003",
    department: "Information Technology",
    phone: "9876543212",
  },
  {
    id: 4,
    eventId: 2,
    studentName: "Sneha Kapoor",
    email: "sneha.kapoor@college.edu",
    registrationDate: "2026-09-28",
    status: "Confirmed",
    rollNo: "CS2022004",
    department: "Computer Science",
    phone: "9876543213",
  },
  {
    id: 5,
    eventId: 2,
    studentName: "Arjun Nair",
    email: "arjun.nair@college.edu",
    registrationDate: "2026-09-29",
    status: "Pending",
    rollNo: "IT2022005",
    department: "Information Technology",
    phone: "9876543214",
  },
  {
    id: 6,
    eventId: 2,
    studentName: "Kavitha Reddy",
    email: "kavitha.reddy@college.edu",
    registrationDate: "2026-09-30",
    status: "Confirmed",
    rollNo: "ECE2022006",
    department: "Electronics",
    phone: "9876543215",
  },
  {
    id: 7,
    eventId: 3,
    studentName: "Siddharth Joshi",
    email: "siddharth.joshi@college.edu",
    registrationDate: "2026-10-01",
    status: "Confirmed",
    rollNo: "CS2023007",
    department: "Computer Science",
    phone: "9876543216",
  },
  {
    id: 8,
    eventId: 4,
    studentName: "Meera Pillai",
    email: "meera.pillai@college.edu",
    registrationDate: "2026-10-02",
    status: "Confirmed",
    rollNo: "ARTS2023008",
    department: "Arts",
    phone: "9876543217",
  },
  {
    id: 9,
    eventId: 5,
    studentName: "Vivek Sharma",
    email: "vivek.sharma@college.edu",
    registrationDate: "2026-10-03",
    status: "Confirmed",
    rollNo: "CS2022009",
    department: "Computer Science",
    phone: "9876543218",
  },
  {
    id: 10,
    eventId: 6,
    studentName: "Anjali Singh",
    email: "anjali.singh@college.edu",
    registrationDate: "2026-08-20",
    status: "Confirmed",
    rollNo: "MECH2021010",
    department: "Mechanical",
    phone: "9876543219",
  },
  {
    id: 11,
    eventId: 7,
    studentName: "Kiran Kumar",
    email: "kiran.kumar@college.edu",
    registrationDate: "2026-09-01",
    status: "Confirmed",
    rollNo: "CS2021011",
    department: "Computer Science",
    phone: "9876543220",
  },
  {
    id: 12,
    eventId: 8,
    studentName: "Deepa Nambiar",
    email: "deepa.nambiar@college.edu",
    registrationDate: "2026-09-15",
    status: "Confirmed",
    rollNo: "MBA2022012",
    department: "Management",
    phone: "9876543221",
  },
];

export const mockFeedback = [
  {
    id: 1,
    eventId: 6,
    studentName: "Anjali Singh",
    rating: 5,
    comment: "Amazing event! Very well organized. The cricket matches were thrilling.",
    suggestions: "Add more refreshment stalls.",
    date: "2026-09-11",
  },
  {
    id: 2,
    eventId: 6,
    studentName: "Ravi Teja",
    rating: 4,
    comment: "Good event overall. Loved the athletics events.",
    suggestions: "Registration process needs improvement.",
    date: "2026-09-11",
  },
  {
    id: 3,
    eventId: 6,
    studentName: "Pooja Iyer",
    rating: 3,
    comment: "The seating was limited. Events ran late.",
    suggestions: "Better time management and more seating.",
    date: "2026-09-12",
  },
  {
    id: 4,
    eventId: 7,
    studentName: "Kiran Kumar",
    rating: 5,
    comment: "Excellent speakers! Very informative sessions on ethical hacking.",
    suggestions: "More hands-on labs would be great.",
    date: "2026-09-21",
  },
  {
    id: 5,
    eventId: 7,
    studentName: "Nisha Verma",
    rating: 4,
    comment: "Well organized. The case studies were eye-opening.",
    suggestions: "Lunch timing could be improved.",
    date: "2026-09-21",
  },
];

export const mockRegistrations = [
  { id: 1, eventId: 1, userId: "student", registrationDate: "2026-09-25", status: "Confirmed" },
  { id: 2, eventId: 8, userId: "student", registrationDate: "2026-09-28", status: "Confirmed" },
];

export const demoAccounts = {
  student: {
    email: "student@demo.com",
    password: "demo123",
    role: "student",
    name: "Alex Johnson",
    department: "Computer Science",
    rollNo: "CS2023042",
  },
  admin: {
    email: "admin@demo.com",
    password: "demo123",
    role: "admin",
    name: "Dr. Admin User",
    department: "Event Management Office",
  },
};

export const mockAIEventPlan = {
  schedule: [
    { time: "09:00 AM", activity: "Registration & Welcome Kit Distribution" },
    { time: "09:30 AM", activity: "Welcome Address & Introduction" },
    { time: "10:00 AM", activity: "Keynote Session by Industry Expert" },
    { time: "11:00 AM", activity: "Technical Workshop – Session 1" },
    { time: "12:00 PM", activity: "Networking Lunch Break" },
    { time: "01:00 PM", activity: "Hands-on Activity / Lab Session" },
    { time: "02:30 PM", activity: "Technical Workshop – Session 2" },
    { time: "03:30 PM", activity: "Team Challenge / Group Activity" },
    { time: "04:30 PM", activity: "Project Showcase & Presentations" },
    { time: "05:30 PM", activity: "Award Ceremony & Certificates" },
    { time: "06:00 PM", activity: "Closing Remarks & Networking" },
  ],
  activities: [
    "Icebreaker activity to energize participants",
    "Team challenge for collaborative problem solving",
    "Interactive workshop with real-world examples",
    "Q&A session with expert panelists",
    "Live coding / demonstration session",
    "Project presentation and peer review",
    "Certificate and prize distribution",
  ],
  tasks: [
    "Book and confirm venue well in advance",
    "Invite and confirm keynote speakers",
    "Set up registration portal or desk",
    "Arrange required equipment (projector, mics, laptops)",
    "Prepare participant kits and materials",
    "Assign volunteers for different roles",
    "Arrange catering for lunch and refreshments",
    "Prepare certificates and trophies",
    "Coordinate with security and facilities team",
    "Set up photography/videography",
  ],
  checklist: [
    { item: "Venue confirmed and booked", done: false },
    { item: "Speakers confirmed", done: false },
    { item: "Projector and AV equipment arranged", done: false },
    { item: "Registration form published", done: false },
    { item: "Volunteers assigned and briefed", done: false },
    { item: "Certificates designed and printed", done: false },
    { item: "Catering arranged", done: false },
    { item: "Social media promotion done", done: false },
    { item: "Participant list finalized", done: false },
    { item: "Event schedule published", done: false },
  ],
  resources: [
    "Projector and large display screen",
    "Microphone and PA system",
    "Laptops / computers for participants",
    "High-speed internet connection",
    "Registration desk and stationery",
    "Tables, chairs, and seating arrangement",
    "Water, refreshments and lunch",
    "First aid kit",
    "Photography equipment",
    "Printed banners and signage",
  ],
};

export const mockAnnouncementTemplates = [
  `🎉 Join us for {eventName}!

Get ready for an exciting experience featuring engaging sessions, hands-on activities, and collaborative learning opportunities.

📅 Date: {date}
⏰ Time: {startTime} – {endTime}
📍 Venue: {venue}
🎯 Category: {category}

Don't miss this incredible opportunity to learn, network, and grow with fellow students and industry professionals.

Register now and secure your spot before it fills up!

For more information, contact the organizing committee.`,

  `📢 Attention Students!

We are thrilled to announce {eventName} — an event you absolutely cannot miss!

{eventName} brings together enthusiastic students, expert mentors, and industry leaders for a day of learning, innovation, and collaboration.

🗓️ Date: {date}
🕐 Time: {startTime} onwards
🏛️ Venue: {venue}

Seats are limited — register early to guarantee your spot!

See you there! 🚀`,
];

export const mockFeedbackAnalysis = {
  averageRating: 4.4,
  totalResponses: 86,
  sentiment: { positive: 72, neutral: 20, negative: 8 },
  positivePoints: [
    "Well-organized sessions and schedule",
    "Helpful and knowledgeable speakers",
    "Interactive and engaging activities",
    "Good venue arrangement and facilities",
    "Quality of learning materials provided",
  ],
  issues: [
    "Lunch timing could be improved",
    "Long queues during registration",
    "Limited seating capacity",
    "Some sessions ran over time",
  ],
  suggestions: [
    "Increase overall seating capacity",
    "Streamline the registration process digitally",
    "Allocate more time for hands-on activities",
    "Provide printed schedule to all participants",
    "Add more networking breaks between sessions",
  ],
  ratingDistribution: [
    { stars: 5, count: 38, percentage: 44 },
    { stars: 4, count: 28, percentage: 33 },
    { stars: 3, count: 12, percentage: 14 },
    { stars: 2, count: 5, percentage: 6 },
    { stars: 1, count: 3, percentage: 3 },
  ],
};
