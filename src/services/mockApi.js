// Mock data for majors
const mockMajors = [
  { title: "Computer Science", college: "College of Computer Engineering and Science" },
  { title: "Computer Engineering", college: "College of Computer Engineering and Science" },
  { title: "Software Engineering", college: "College of Computer Engineering and Science" },
  { title: "Cybersecurity", college: "College of Computer Engineering and Science" },
  { title: "Artificial Intelligence", college: "College of Computer Engineering and Science" },
  { title: "Mechanical Engineering", college: "College of Engineering" },
  { title: "Civil Engineering", college: "College of Engineering" },
  { title: "Electrical Engineering", college: "College of Engineering" },
  { title: "Chemical Engineering", college: "College of Engineering" },
  { title: "Petroleum Engineering", college: "College of Engineering" },
  { title: "Accounting", college: "College of Business Administration" },
  { title: "Finance", college: "College of Business Administration" },
  { title: "Marketing", college: "College of Business Administration" },
  { title: "Management Information Systems", college: "College of Business Administration" },
  { title: "Human Resource Management", college: "College of Business Administration" },
  { title: "Interior Design", college: "College of Architecture and Design" },
  { title: "Architecture", college: "College of Architecture and Design" },
  { title: "Graphic Design", college: "College of Architecture and Design" },
  { title: "English Language", college: "College of Arts and Sciences" },
  { title: "Mathematics", college: "College of Arts and Sciences" },
  { title: "Physics", college: "College of Arts and Sciences" },
  { title: "Chemistry", college: "College of Arts and Sciences" },
  { title: "Biology", college: "College of Arts and Sciences" },
  { title: "Law", college: "College of Law" }
];

// Mock professors data
const mockProfessors = {
  "CS 101": [
    { name: "Dr. Sarah Smith", email: "ssmith@pmu.edu", office: "Building A, Room 101" },
    { name: "Dr. Michael Johnson", email: "mjohnson@pmu.edu", office: "Building A, Room 102" }
  ],
  "CS 201": [
    { name: "Dr. David Wilson", email: "dwilson@pmu.edu", office: "Building A, Room 201" },
    { name: "Dr. Emily Brown", email: "ebrown@pmu.edu", office: "Building A, Room 202" }
  ],
  "SE 101": [
    { name: "Dr. Robert Anderson", email: "randerson@pmu.edu", office: "Building B, Room 101" },
    { name: "Dr. Lisa Thomas", email: "lthomas@pmu.edu", office: "Building B, Room 102" }
  ],
  "SE 201": [
    { name: "Dr. James White", email: "jwhite@pmu.edu", office: "Building B, Room 201" },
    { name: "Dr. Jennifer Harris", email: "jharris@pmu.edu", office: "Building B, Room 202" }
  ]
};

// Default professors for courses without specific professors
const defaultProfessors = [
  { name: "Dr. John Faculty", email: "jfaculty@pmu.edu", office: "Main Building, Room 101" },
  { name: "Dr. Mary Professor", email: "mprofessor@pmu.edu", office: "Main Building, Room 102" }
];

// Mock courses data by major
const mockCoursesByMajor = {
  "Computer Science": [
    { code: "CS 101", courseName: "Introduction to Programming", credits: 3, instructor: "Dr. Smith", schedule: "Sun/Tue 10:00-11:15", prerequisites: [] },
    { code: "CS 201", courseName: "Data Structures", credits: 3, instructor: "Dr. Johnson", schedule: "Mon/Wed 13:00-14:15", prerequisites: ["CS 101"] },
    { code: "CS 301", courseName: "Algorithms", credits: 3, instructor: "Dr. Williams", schedule: "Sun/Tue 14:30-15:45", prerequisites: ["CS 201"] },
    { code: "CS 310", courseName: "Database Systems", credits: 3, instructor: "Dr. Brown", schedule: "Mon/Wed 10:00-11:15", prerequisites: ["CS 201"] },
    { code: "CS 320", courseName: "Software Engineering", credits: 4, instructor: "Dr. Davis", schedule: "Sun/Tue 08:30-09:45", prerequisites: ["CS 201"] },
    { code: "CS 330", courseName: "Computer Networks", credits: 3, instructor: "Dr. Miller", schedule: "Mon/Wed 15:00-16:15", prerequisites: ["CS 201"] },
    { code: "CS 340", courseName: "Operating Systems", credits: 4, instructor: "Dr. Wilson", schedule: "Sun/Tue 13:00-14:15", prerequisites: ["CS 201"] },
    { code: "CS 350", courseName: "Computer Graphics", credits: 3, instructor: "Dr. Moore", schedule: "Mon/Wed 08:30-09:45", prerequisites: ["CS 201", "MATH 240"] },
    { code: "CS 401", courseName: "Artificial Intelligence", credits: 3, instructor: "Dr. Taylor", schedule: "Sun/Tue 11:30-12:45", prerequisites: ["CS 301"] }
  ],
  "Software Engineering": [
    { code: "SE 101", courseName: "Introduction to Software Engineering", credits: 3, instructor: "Dr. Anderson", schedule: "Sun/Tue 10:00-11:15", prerequisites: [] },
    { code: "SE 201", courseName: "Software Requirements Engineering", credits: 3, instructor: "Dr. Thomas", schedule: "Mon/Wed 13:00-14:15", prerequisites: ["SE 101"] },
    { code: "SE 301", courseName: "Software Design", credits: 3, instructor: "Dr. Jackson", schedule: "Sun/Tue 14:30-15:45", prerequisites: ["SE 201"] },
    { code: "SE 310", courseName: "Software Testing", credits: 3, instructor: "Dr. White", schedule: "Mon/Wed 10:00-11:15", prerequisites: ["SE 201"] },
    { code: "SE 320", courseName: "Software Project Management", credits: 3, instructor: "Dr. Harris", schedule: "Sun/Tue 08:30-09:45", prerequisites: ["SE 201"] },
    { code: "SE 401", courseName: "Software Quality Assurance", credits: 3, instructor: "Dr. Martin", schedule: "Mon/Wed 15:00-16:15", prerequisites: ["SE 301", "SE 310"] }
  ],
  "Electrical Engineering": [
    { code: "EE 101", courseName: "Introduction to Electrical Engineering", credits: 3, instructor: "Dr. Thompson", schedule: "Sun/Tue 10:00-11:15", prerequisites: [] },
    { code: "EE 201", courseName: "Circuit Analysis", credits: 4, instructor: "Dr. Garcia", schedule: "Mon/Wed 13:00-14:15", prerequisites: ["EE 101", "PHYS 102"] },
    { code: "EE 301", courseName: "Signals and Systems", credits: 3, instructor: "Dr. Martinez", schedule: "Sun/Tue 14:30-15:45", prerequisites: ["EE 201"] },
    { code: "EE 310", courseName: "Electronics I", credits: 4, instructor: "Dr. Robinson", schedule: "Mon/Wed 10:00-11:15", prerequisites: ["EE 201"] },
    { code: "EE 320", courseName: "Digital Logic Design", credits: 3, instructor: "Dr. Clark", schedule: "Sun/Tue 08:30-09:45", prerequisites: ["EE 101"] },
    { code: "EE 330", courseName: "Electromagnetic Fields", credits: 3, instructor: "Dr. Rodriguez", schedule: "Mon/Wed 15:00-16:15", prerequisites: ["EE 201", "MATH 240"] }
  ]
};

// Default courses for majors not explicitly defined
const defaultCourses = [
  { code: "101", courseName: "Introduction Course", credits: 3, instructor: "Dr. Faculty", schedule: "Sun/Tue 10:00-11:15", prerequisites: [] },
  { code: "201", courseName: "Intermediate Course I", credits: 3, instructor: "Dr. Professor", schedule: "Mon/Wed 13:00-14:15", prerequisites: ["101"] },
  { code: "202", courseName: "Intermediate Course II", credits: 3, instructor: "Dr. Lecturer", schedule: "Sun/Tue 14:30-15:45", prerequisites: ["101"] },
  { code: "301", courseName: "Advanced Course I", credits: 4, instructor: "Dr. Expert", schedule: "Mon/Wed 10:00-11:15", prerequisites: ["201"] },
  { code: "302", courseName: "Advanced Course II", credits: 4, instructor: "Dr. Specialist", schedule: "Sun/Tue 08:30-09:45", prerequisites: ["201", "202"] }
];

// Mock data
const mockCourses = {
  "SE101": {
    id: "285dbf9e-adb5-4c91-bc70-fdb71c49bc79",
    courseName: "Introduction to Software Engineering",
    majors: [
      { id: "f28f55ec-f70a-402a-afec-f76a17f6ac75", title: "Software Engineering", college: "CCES" }
    ],
    professors: [
      { id: "2267ab32-5c51-4c69-9b03-f8ca61a482c4", professorName: "Dr. Zakaria" },
      { id: "3378bc43-6d62-5d7a-0c14-g9db72b593d5", professorName: "Dr. Anderson" }
    ]
  }
};

// Mock API service
const mockApiService = {
  // Simulate fetching majors with a delay to mimic real API behavior
  fetchMajors: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMajors);
      }, 800); // 800ms delay to simulate network request
    });
  },
  
  // Simulate fetching courses for a specific major
  fetchCourses: (majorTitle) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courses = Object.values(mockCourses)
          .filter(course => course.majors.some(major => major.title === majorTitle));
        resolve(courses);
      }, 800);
    });
  },

  // Simulate fetching course details including professors
  fetchCourseDetails: (courseId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCourses[courseId] || {
          id: courseId,
          courseName: `Course ${courseId}`,
          majors: [{ id: "default", title: "General", college: "CCES" }],
          professors: [{ id: "default", professorName: "Dr. Faculty" }]
        });
      }, 800);
    });
  }
};

export default mockApiService;
