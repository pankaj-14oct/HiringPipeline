import { db } from "./db";
import { questionBank } from "@shared/schema";

// Comprehensive technical question bank for assessments
const technicalQuestions = [
  // HTML Questions
  {
    question: "What is the difference between <div> and <span> elements?",
    type: "mcq",
    category: "HTML",
    difficulty: "easy",
    options: [
      "<div> is block-level, <span> is inline",
      "<div> is inline, <span> is block-level", 
      "They are exactly the same",
      "<div> is for text, <span> is for images"
    ],
    correctAnswer: 0,
    explanation: "<div> is a block-level element that takes full width, while <span> is an inline element that only takes necessary width.",
    points: 1
  },
  {
    question: "Which HTML5 semantic element should be used for the main content area?",
    type: "mcq",
    category: "HTML",
    difficulty: "easy",
    options: ["<section>", "<article>", "<main>", "<content>"],
    correctAnswer: 2,
    explanation: "The <main> element represents the main content area of the document.",
    points: 1
  },
  {
    question: "What does the 'alt' attribute in <img> tag provide?",
    type: "mcq",
    category: "HTML",
    difficulty: "easy",
    options: [
      "Alternative text for screen readers and when image fails to load",
      "Image alignment",
      "Image size",
      "Image filter"
    ],
    correctAnswer: 0,
    explanation: "The alt attribute provides alternative text for accessibility and when images fail to load.",
    points: 1
  },
  {
    question: "Which HTML element is used to group form controls?",
    type: "mcq",
    category: "HTML",
    difficulty: "medium",
    options: ["<group>", "<fieldset>", "<formgroup>", "<section>"],
    correctAnswer: 1,
    explanation: "The <fieldset> element is used to group related form controls together.",
    points: 2
  },
  {
    question: "What is the purpose of the 'doctype' declaration?",
    type: "mcq",
    category: "HTML",
    difficulty: "medium",
    options: [
      "Defines the HTML version and rendering mode",
      "Sets the page title",
      "Links external stylesheets",
      "Defines character encoding"
    ],
    correctAnswer: 0,
    explanation: "The doctype declaration tells the browser which HTML version to use and triggers standards mode.",
    points: 2
  },

  // CSS Questions
  {
    question: "What does CSS stand for?",
    type: "mcq",
    category: "CSS",
    difficulty: "easy",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style Sheets",
      "Colorful Style Sheets"
    ],
    correctAnswer: 1,
    explanation: "CSS stands for Cascading Style Sheets, used for styling HTML documents.",
    points: 1
  },
  {
    question: "Which CSS property is used to change text color?",
    type: "mcq",
    category: "CSS",
    difficulty: "easy",
    options: ["font-color", "text-color", "color", "foreground-color"],
    correctAnswer: 2,
    explanation: "The 'color' property is used to set the text color in CSS.",
    points: 1
  },
  {
    question: "What is the difference between 'margin' and 'padding'?",
    type: "mcq",
    category: "CSS",
    difficulty: "easy",
    options: [
      "Margin is inside the border, padding is outside",
      "Margin is outside the border, padding is inside",
      "They are the same thing",
      "Margin is for text, padding is for images"
    ],
    correctAnswer: 1,
    explanation: "Margin creates space outside the element's border, while padding creates space inside the border.",
    points: 1
  },
  {
    question: "Which CSS unit is relative to the font size of the root element?",
    type: "mcq",
    category: "CSS",
    difficulty: "medium",
    options: ["em", "rem", "px", "vh"],
    correctAnswer: 1,
    explanation: "'rem' units are relative to the root element's font size, while 'em' is relative to the parent element.",
    points: 2
  },
  {
    question: "What does the CSS 'box-sizing: border-box' property do?",
    type: "mcq",
    category: "CSS",
    difficulty: "medium",
    options: [
      "Includes padding and border in element's total width/height",
      "Excludes padding and border from width/height",
      "Only includes border in calculations",
      "Only includes padding in calculations"
    ],
    correctAnswer: 0,
    explanation: "border-box includes padding and border in the element's total width and height calculations.",
    points: 2
  },
  {
    question: "Which CSS property is used to create a flexible layout?",
    type: "mcq",
    category: "CSS",
    difficulty: "hard",
    options: ["display: block", "display: flex", "display: inline", "display: table"],
    correctAnswer: 1,
    explanation: "display: flex enables flexbox layout for creating flexible and responsive designs.",
    points: 3
  },

  // JavaScript Questions
  {
    question: "Which method is used to add an element to the end of an array?",
    type: "mcq",
    category: "JavaScript",
    difficulty: "easy",
    options: ["append()", "push()", "add()", "insert()"],
    correctAnswer: 1,
    explanation: "The push() method adds one or more elements to the end of an array.",
    points: 1
  },
  {
    question: "What is the difference between '==' and '===' in JavaScript?",
    type: "mcq",
    category: "JavaScript",
    difficulty: "easy",
    options: [
      "'==' checks type and value, '===' checks only value",
      "'==' checks only value, '===' checks type and value",
      "They are exactly the same",
      "'==' is for numbers, '===' is for strings"
    ],
    correctAnswer: 1,
    explanation: "'==' performs type coercion and checks value, while '===' checks both type and value without coercion.",
    points: 1
  },
  {
    question: "Which keyword is used to declare a block-scoped variable?",
    type: "mcq",
    category: "JavaScript",
    difficulty: "easy",
    options: ["var", "let", "const", "Both let and const"],
    correctAnswer: 3,
    explanation: "Both 'let' and 'const' create block-scoped variables, unlike 'var' which is function-scoped.",
    points: 1
  },
  {
    question: "What does the 'this' keyword refer to in JavaScript?",
    type: "mcq",
    category: "JavaScript",
    difficulty: "medium",
    options: [
      "The current function",
      "The global object",
      "The object that invokes the function",
      "The parent function"
    ],
    correctAnswer: 2,
    explanation: "'this' refers to the object that is executing the current function, which can vary based on how the function is called.",
    points: 2
  },
  {
    question: "Which method creates a new array with all elements that pass a test?",
    type: "mcq",
    category: "JavaScript",
    difficulty: "medium",
    options: ["map()", "filter()", "reduce()", "forEach()"],
    correctAnswer: 1,
    explanation: "The filter() method creates a new array with elements that pass the test implemented by the provided function.",
    points: 2
  },
  {
    question: "What is a closure in JavaScript?",
    type: "mcq",
    category: "JavaScript",
    difficulty: "hard",
    options: [
      "A function that returns another function",
      "A function with access to variables in its outer scope",
      "A function that calls itself",
      "A function without parameters"
    ],
    correctAnswer: 1,
    explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns.",
    points: 3
  },

  // React Questions
  {
    question: "What is JSX in React?",
    type: "mcq",
    category: "React",
    difficulty: "easy",
    options: [
      "JavaScript Extension",
      "JavaScript XML",
      "JSON Extension",
      "Java Syntax Extension"
    ],
    correctAnswer: 1,
    explanation: "JSX stands for JavaScript XML, which allows writing HTML elements in JavaScript.",
    points: 1
  },
  {
    question: "Which hook is used to manage state in functional components?",
    type: "mcq",
    category: "React",
    difficulty: "easy",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 1,
    explanation: "useState is the hook used to add state management to functional components.",
    points: 1
  },
  {
    question: "What is the purpose of the useEffect hook?",
    type: "mcq",
    category: "React",
    difficulty: "medium",
    options: [
      "To manage component state",
      "To handle side effects",
      "To create context",
      "To optimize performance"
    ],
    correctAnswer: 1,
    explanation: "useEffect is used to handle side effects like API calls, subscriptions, and DOM manipulation.",
    points: 2
  },
  {
    question: "What is the virtual DOM in React?",
    type: "mcq",
    category: "React",
    difficulty: "medium",
    options: [
      "A copy of the real DOM in memory",
      "A server-side DOM",
      "A database representation of the DOM",
      "A CSS representation of the DOM"
    ],
    correctAnswer: 0,
    explanation: "The virtual DOM is a JavaScript representation of the actual DOM that React uses for efficient updates.",
    points: 2
  },
  {
    question: "Which pattern is used to pass data through the component tree without prop drilling?",
    type: "mcq",
    category: "React",
    difficulty: "hard",
    options: ["Props", "State", "Context", "Refs"],
    correctAnswer: 2,
    explanation: "React Context provides a way to pass data through the component tree without prop drilling.",
    points: 3
  },

  // Node.js Questions
  {
    question: "What is Node.js primarily used for?",
    type: "mcq",
    category: "Node.js",
    difficulty: "easy",
    options: [
      "Frontend development",
      "Server-side JavaScript",
      "Database management",
      "Mobile app development"
    ],
    correctAnswer: 1,
    explanation: "Node.js is a runtime environment for executing JavaScript on the server side.",
    points: 1
  },
  {
    question: "Which module is used to create HTTP servers in Node.js?",
    type: "mcq",
    category: "Node.js",
    difficulty: "easy",
    options: ["fs", "path", "http", "url"],
    correctAnswer: 2,
    explanation: "The 'http' module is used to create HTTP servers and clients in Node.js.",
    points: 1
  },
  {
    question: "What is npm?",
    type: "mcq",
    category: "Node.js",
    difficulty: "easy",
    options: [
      "Node Package Manager",
      "New Programming Method",
      "Network Protocol Manager",
      "Node Process Manager"
    ],
    correctAnswer: 0,
    explanation: "npm is the Node Package Manager, used to install and manage JavaScript packages.",
    points: 1
  },
  {
    question: "What is the purpose of package.json?",
    type: "mcq",
    category: "Node.js",
    difficulty: "medium",
    options: [
      "Contains project metadata and dependencies",
      "Stores application data",
      "Configures the server",
      "Defines database schema"
    ],
    correctAnswer: 0,
    explanation: "package.json contains project metadata, dependencies, scripts, and configuration information.",
    points: 2
  },
  {
    question: "Which Node.js module is used for file system operations?",
    type: "mcq",
    category: "Node.js",
    difficulty: "medium",
    options: ["file", "fs", "system", "io"],
    correctAnswer: 1,
    explanation: "The 'fs' (file system) module provides APIs for interacting with the file system.",
    points: 2
  },

  // TypeScript Questions
  {
    question: "What is TypeScript?",
    type: "mcq",
    category: "TypeScript",
    difficulty: "easy",
    options: [
      "A JavaScript runtime",
      "A superset of JavaScript with static typing",
      "A database language",
      "A CSS preprocessor"
    ],
    correctAnswer: 1,
    explanation: "TypeScript is a superset of JavaScript that adds static type checking.",
    points: 1
  },
  {
    question: "Which keyword is used to define a TypeScript interface?",
    type: "mcq",
    category: "TypeScript",
    difficulty: "easy",
    options: ["type", "interface", "class", "struct"],
    correctAnswer: 1,
    explanation: "The 'interface' keyword is used to define the structure of an object in TypeScript.",
    points: 1
  },
  {
    question: "What is the difference between 'interface' and 'type' in TypeScript?",
    type: "mcq",
    category: "TypeScript",
    difficulty: "medium",
    options: [
      "They are exactly the same",
      "Interface can be extended, type cannot",
      "Interface can be merged, type cannot",
      "Type is for primitives, interface is for objects"
    ],
    correctAnswer: 2,
    explanation: "Interfaces can be merged (declaration merging) while types cannot. Both can be extended.",
    points: 2
  },
  {
    question: "What does the '?' symbol mean in TypeScript?",
    type: "mcq",
    category: "TypeScript",
    difficulty: "medium",
    options: [
      "Required property",
      "Optional property",
      "Nullable property",
      "Private property"
    ],
    correctAnswer: 1,
    explanation: "The '?' symbol marks a property as optional in TypeScript interfaces and types.",
    points: 2
  },
  {
    question: "What is a union type in TypeScript?",
    type: "mcq",
    category: "TypeScript",
    difficulty: "hard",
    options: [
      "A type that combines multiple interfaces",
      "A type that can be one of several types",
      "A type that extends another type",
      "A type for database unions"
    ],
    correctAnswer: 1,
    explanation: "A union type allows a value to be one of several types, defined using the '|' operator.",
    points: 3
  },

  // Database Questions
  {
    question: "What does SQL stand for?",
    type: "mcq",
    category: "Database",
    difficulty: "easy",
    options: [
      "Structured Query Language",
      "Simple Query Language",
      "Standard Query Language",
      "System Query Language"
    ],
    correctAnswer: 0,
    explanation: "SQL stands for Structured Query Language, used for managing relational databases.",
    points: 1
  },
  {
    question: "Which SQL command is used to retrieve data?",
    type: "mcq",
    category: "Database",
    difficulty: "easy",
    options: ["GET", "FETCH", "SELECT", "RETRIEVE"],
    correctAnswer: 2,
    explanation: "SELECT is the SQL command used to retrieve data from database tables.",
    points: 1
  },
  {
    question: "What is a primary key?",
    type: "mcq",
    category: "Database",
    difficulty: "easy",
    options: [
      "A key that unlocks the database",
      "A unique identifier for each record",
      "The first column in a table",
      "A password for database access"
    ],
    correctAnswer: 1,
    explanation: "A primary key is a unique identifier for each record in a database table.",
    points: 1
  },
  {
    question: "What is the difference between INNER JOIN and LEFT JOIN?",
    type: "mcq",
    category: "Database",
    difficulty: "medium",
    options: [
      "INNER JOIN returns all records, LEFT JOIN returns matched records only",
      "INNER JOIN returns matched records only, LEFT JOIN returns all records from left table",
      "They are the same",
      "INNER JOIN is faster than LEFT JOIN"
    ],
    correctAnswer: 1,
    explanation: "INNER JOIN returns only matched records, while LEFT JOIN returns all records from the left table plus matched records from the right table.",
    points: 2
  }
];

export async function seedQuestionBank() {
  try {
    console.log("🧠 Seeding question bank...");
    
    // Add creator ID (using first HR user from seed data)
    const questionsWithCreator = technicalQuestions.map(q => ({
      ...q,
      createdBy: "sarah.johnson", // This should match the HR user from main seed
      correctAnswer: JSON.stringify(q.correctAnswer),
      options: JSON.stringify(q.options),
      tags: JSON.stringify([q.category.toLowerCase(), q.difficulty])
    }));

    const createdQuestions = await db.insert(questionBank).values(questionsWithCreator).returning();
    console.log(`✅ Created ${createdQuestions.length} questions in question bank`);
    
    // Show breakdown by category
    const categories = Array.from(new Set(technicalQuestions.map(q => q.category)));
    for (const category of categories) {
      const count = technicalQuestions.filter(q => q.category === category).length;
      console.log(`   - ${category}: ${count} questions`);
    }
    
    return createdQuestions;
  } catch (error) {
    console.error("❌ Error seeding question bank:", error);
    throw error;
  }
}

// Execute the seed function if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedQuestionBank().catch(console.error);
}