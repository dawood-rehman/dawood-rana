"use client";

import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm an AI assistant here to help you learn about Dawood Rehman. Feel free to ask me anything about his education, skills, projects, or background!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced knowledge base with more authentic responses
  const knowledgeBase = {
    about: {
      keywords: [
        "who",
        "about",
        "tell me",
        "introduce",
        "dawood",
        "him",
        "person",
        "background",
        "info",
        "information",
      ],
      responses: [
        "Dawood Rehman is a passionate Computer Science student and full-stack developer currently pursuing his Bachelor's degree at Government College University Faisalabad. He's deeply passionate about technology and loves building innovative digital solutions.",
        "Dawood is a tech enthusiast who thrives on solving complex problems through code. He's currently studying Computer Science at GCU Faisalabad and has a strong foundation in modern web development technologies.",
        "He's a dedicated Computer Science student with a diverse educational background - from science stream to pre-medical, and now pursuing his passion in tech. Dawood is always eager to learn and explore new technologies!",
      ],
    },
    education: {
      keywords: [
        "education",
        "school",
        "university",
        "college",
        "degree",
        "study",
        "studying",
        "academic",
        "qualification",
        "gcuf",
        "gcu",
        "faisalabad",
      ],
      responses: [
        "Dawood's educational journey is quite interesting! He completed his high school at Government MC High School in the science stream, then pursued pre-medical at Government MC Higher Secondary School, and is currently studying Computer Science at Government College University Faisalabad (GCUF).",
        "His academic path shows versatility - starting with science, then pre-medical, and now Computer Science at GCU Faisalabad. This diverse background gives him a unique perspective in problem-solving!",
        "Dawood is currently pursuing a Bachelor's degree in Computer Science at Government College University Faisalabad. Before that, he completed his higher secondary education in pre-medical and high school in science stream.",
      ],
    },
    skills: {
      keywords: [
        "skill",
        "technology",
        "tech",
        "programming",
        "language",
        "framework",
        "html",
        "css",
        "javascript",
        "typescript",
        "mongodb",
        "github",
        "c++",
        "expertise",
        "proficient",
        "know",
        "learned",
        "can do",
      ],
      responses: [
        "Dawood is skilled in a wide range of technologies! He's proficient in HTML, CSS, JavaScript, and TypeScript for frontend development. For backend, he works with MongoDB and handles API integration. He also uses GitHub for version control and knows C++ programming.",
        "His technical stack includes modern web technologies: HTML, CSS, JavaScript, and TypeScript for building user interfaces, MongoDB for database management, API integration for connecting services, GitHub for collaboration, and C++ for system-level programming. He's a full-stack developer!",
        "Dawood has expertise in both frontend and backend technologies. Frontend: HTML, CSS, JavaScript, TypeScript. Backend: MongoDB, API integration. Tools: GitHub. Languages: C++. He's always expanding his skill set!",
      ],
    },
    contact: {
      keywords: [
        "contact",
        "reach",
        "connect",
        "email",
        "phone",
        "social",
        "facebook",
        "instagram",
        "linkedin",
        "whatsapp",
        "github",
        "get in touch",
        "how to reach",
        "where",
        "address",
      ],
      responses: [
        "You can reach Dawood through multiple channels! Email: rd535328@gmail.com, Phone: +92 314 4885177. He's also active on social media - Facebook, Instagram, LinkedIn, GitHub, and WhatsApp. Check out the contact section for direct links to all his profiles!",
        "Dawood is easily reachable! Contact him via email at rd535328@gmail.com or call +92 314 4885177. He's also on Facebook, Instagram, LinkedIn, GitHub, and WhatsApp. Feel free to connect with him on any platform!",
        "To get in touch with Dawood, you can email him at rd535328@gmail.com or call +92 314 4885177. He's based in Faisalabad, Pakistan. You can also find him on social media platforms like Facebook, Instagram, LinkedIn, GitHub, and WhatsApp.",
      ],
    },
    projects: {
      keywords: [
        "project",
        "work",
        "portfolio",
        "built",
        "created",
        "developed",
        "app",
        "application",
        "website",
        "completed",
        "client",
      ],
      responses: [
        "Dawood has worked on various exciting projects! He's built e-commerce platforms, task management applications, social media dashboards, and weather forecast apps. He's also completed projects for clients including corporate websites, e-learning platforms, and restaurant management systems. Check out the Projects and Completed Projects sections to see more details!",
        "He's developed multiple projects showcasing his full-stack capabilities - from e-commerce solutions to collaborative task management apps. Dawood has also delivered successful projects for clients, with great feedback! You can see his work in the Projects section.",
        "Dawood has a portfolio of diverse projects including web applications, management systems, and client work. He's completed over 50 projects with 45+ happy clients and maintains 100% client satisfaction. Explore the Projects section to learn more!",
      ],
    },
    passion: {
      keywords: [
        "passion",
        "interest",
        "love",
        "enjoy",
        "hobby",
        "motivation",
        "drive",
        "excited",
        "enthusiastic",
      ],
      responses: [
        "Dawood is deeply passionate about technology and innovation! He loves full-stack development, solving complex problems, and continuously learning new technologies. His journey in tech is fueled by curiosity and the excitement of turning ideas into reality through code.",
        "He's passionate about building scalable web applications, exploring emerging technologies, and creating digital solutions that make a real impact. Dawood thrives on continuous learning and staying ahead in the tech industry!",
        "Dawood's passion lies in technology innovation, problem-solving, and full-stack development. He's always eager to learn new frameworks and methodologies, and he gets excited about turning creative ideas into functional digital solutions!",
      ],
    },
    greeting: {
      keywords: [
        "hello",
        "hi",
        "hey",
        "greetings",
        "good morning",
        "good afternoon",
        "good evening",
      ],
      responses: [
        "Hello! I'm here to help you learn about Dawood Rehman. Feel free to ask me anything about his education, skills, projects, or background!",
        "Hi there! Welcome! I can tell you all about Dawood - his education, technical skills, projects, or how to get in touch with him. What would you like to know?",
        "Hey! Great to meet you! I'm here to answer questions about Dawood Rehman. Ask me about his studies, skills, work, or anything else!",
      ],
    },
    age: {
      keywords: ["age", "old", "birthday", "birth", "when born"],
      responses: [
        "Dawood Rehman is 19 years old and born on 28 march 2007, full of energy and passion for building amazing digital products!",
        "He's currently 21 years old — young, ambitious, and continuously leveling up his tech skills.",
        "At 21, Dawood is already gaining strong experience in full-stack development and real-world client projects.",
      ],
    },
    love: {
      keywords: [
        "love",
        "lover",
        "relationship",
        "girlfriend",
        "in love",
        "crush",
      ],
      responses: [
        "Dawood is currently fully focused on his career and personal growth. His true love right now is technology and coding!",
        "He believes in prioritizing career, passion, and goals — the right time brings the right person.",
        "Dawood is not in any relationship at the moment; he's committed to building his future first.",
      ],
    },
    favourites: {
      keywords: [
        "favorite",
        "favourite",
        "like most",
        "best",
        "love to",
        "prefer",
      ],
      responses: [
        "Dawood loves technology, coding, exploring new tools, and working on unique digital solutions!",
        "His favorite activities include building web apps, learning modern frameworks, and solving challenging problems.",
        "He enjoys clean UI/UX, creative development, and experimenting with new tech stacks.",
      ],
    },
    dish: {
      keywords: [
        "food",
        "dish",
        "eat",
        "favourite food",
        "favourite dish",
        "meal",
      ],
      responses: [
        "Dawood’s favorite dish is Biryani — especially spicy, flavorful, and perfectly layered!",
        "He enjoys Pakistani traditional dishes, with Biryani being his all-time favorite.",
        "When it comes to food, Biryani and Chicken Karahi are at the top of Dawood’s list!",
      ],
    },
    player: {
      keywords: [
        "player",
        "favourite player",
        "sportsman",
        "cricketer",
        "footballer",
      ],
      responses: [
        "Dawood’s favorite player is Muhammad Amir 05 — he admires his elegance, focus, and consistency in cricket.",
        "In sports, he really looks up to Muhammad Amir due to his angriness and leadership qualities.",
        "Dawood considers Muhammad Amir as an inspiration for staying disciplined and performing under pressure.",
      ],
    },
    favouriteSport: {
      keywords: [
        "sport",
        "sports",
        "game",
        "favourite sport",
        "play",
        "cricket",
        "football",
      ],
      responses: [
        "Dawood’s favorite sport is Cricket! He enjoys watching and playing it whenever he gets the chance.",
        "Cricket is his favourite sport — especially T20s and ODI matches.",
        "He loves cricket for its strategy, teamwork, and high-energy environment.",
      ],
    },
    sportRole: {
      keywords: [
        "role",
        "position",
        "batting",
        "bowling",
        "keeper",
        "allrounder",
      ],
      responses: [
        "Dawood loves batting when playing cricket — he enjoys timing the ball and building partnerships.",
        "His favorite role in cricket is batting. He enjoys playing stylish shots and contributing runs to the team.",
        "When playing cricket, Dawood mainly prefers batting, focusing on timing and technique over power.",
      ],
    },
    achievements: {
      keywords: [
        "achievement",
        "achievements",
        "accomplishment",
        "success",
        "milestone",
      ],
      responses: [
        "Dawood has successfully completed 10+ projects with 5+ satisfied clients — a huge achievement at his age!",
        "He has built multiple full-stack applications and management systems that helped clients improve their businesses.",
        "His achievements include top-rated client feedback, building complex apps, and continuously learning cutting-edge technologies.",
      ],
    },
    goals: {
      keywords: ["goal", "future", "aim", "dream", "vision", "plan"],
      responses: [
        "Dawood’s goal is to become a top-tier full-stack developer and create impactful digital products.",
        "He aims to build scalable applications, master advanced technologies, and grow as a tech entrepreneur.",
        "His long-term vision includes starting his own tech company and contributing to the global software industry.",
      ],
    },

    personality: {
      keywords: ["personality", "character", "nature", "behaviour", "behavior"],
      responses: [
        "Dawood is a calm, focused, and hardworking person who loves solving problems logically.",
        "His personality reflects discipline, creativity, and a strong passion for continuous learning.",
        "He’s helpful, friendly, and dedicated — always ready to learn and share knowledge with others.",
      ],
    },
    languages: {
      keywords: ["language", "speak", "urdu", "english", "punjabi"],
      responses: [
        "Dawood speaks Urdu, Punjabi, and English confidently!",
        "He is fluent in Urdu and Punjabi, and communicates well in English too.",
        "His main languages are Urdu, Punjabi, and English.",
      ],
    },
    experience: {
      keywords: ["experience", "work experience", "years", "how long"],
      responses: [
        "Dawood has over 2+ years of experience working with full-stack development and real-world client projects.",
        "He has strong experience working on e-commerce sites, dashboards, management systems, and custom applications.",
        "With 2+ years of hands-on development experience, Dawood has built dozens of successful projects.",
      ],
    },
    default: {
      keywords: [],
      responses: [
        "That's an interesting question! I can help you learn about Dawood's education, skills, projects, passion for tech, or contact information. What would you like to know more about?",
        "I'd be happy to help! You can ask me about Dawood's educational background, technical skills, projects he's worked on, his passion for technology, or how to contact him. What interests you?",
        "Great question! I can share information about Dawood's Computer Science studies, his programming skills, the projects he's built, or ways to connect with him. What would you like to explore?",
      ],
    },
  };

  // Enhanced response generator with better matching
  const getResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Remove common words for better matching
    const words = lowerMessage
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 &&
          ![
            "the",
            "and",
            "for",
            "are",
            "but",
            "not",
            "you",
            "all",
            "can",
            "her",
            "was",
            "one",
            "our",
            "out",
            "day",
            "get",
            "has",
            "him",
            "his",
            "how",
            "its",
            "may",
            "new",
            "now",
            "old",
            "see",
            "two",
            "way",
            "who",
            "boy",
            "did",
            "its",
            "let",
            "put",
            "say",
            "she",
            "too",
            "use",
          ].includes(word)
      );

    // Calculate scores for each category
    const scores = {};
    Object.keys(knowledgeBase).forEach((category) => {
      scores[category] = 0;
      const keywords = knowledgeBase[category].keywords;

      keywords.forEach((keyword) => {
        // Exact match gets higher score
        if (lowerMessage.includes(keyword)) {
          scores[category] += keyword.length > 4 ? 3 : 2;
        }
        // Word match gets medium score
        if (
          words.some((word) => word.includes(keyword) || keyword.includes(word))
        ) {
          scores[category] += 1;
        }
      });
    });

    // Find the category with highest score
    const sortedCategories = Object.keys(scores).sort(
      (a, b) => scores[b] - scores[a]
    );
    const bestMatch = sortedCategories[0];
    const bestScore = scores[bestMatch];

    // If no good match (score too low), use default
    if (bestScore < 2) {
      const defaultResponses = knowledgeBase.default.responses;
      return defaultResponses[
        Math.floor(Math.random() * defaultResponses.length)
      ];
    }

    // Get random response from best matching category
    const responses = knowledgeBase[bestMatch].responses;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    // Simulate thinking time for more authentic feel
    const thinkingTime = 300 + Math.random() * 400; // 300-700ms

    setTimeout(() => {
      const response = getResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    }, thinkingTime);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 right-6 md:bottom-40 z-50 bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaRobot className="text-xl" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-6 md:bottom-48 z-50 w-80 md:w-96 h-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 p-4 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <FaRobot /> AI Assistant
              </h3>
              <p className="text-xs opacity-90">Ask me about Dawood Rehman</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
