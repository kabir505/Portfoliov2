import React, { useEffect, useState, useCallback } from "react";

import { supabase } from "../supabase";
// import SupabaseTest from "../components/SupabaseTest"; 

import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import WorkExperience from "../components/WorkExperience";
import { Code, Briefcase, Boxes } from "lucide-react";


const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "Show Less" : "Show More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
        <Typography component="div">{children}</Typography>
      </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// techStacks tetap sama
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

export default function FullWidthTabs() {
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllWorkExperience, setShowAllWorkExperience] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialProjects = 8; // Always show 8 projects
  const initialWorkExperience = 4; // Always show 4 work experiences

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);


  const fetchData = useCallback(async () => {
    try {
      // Debug: Log environment variables
      console.log("🔍 Debug - VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log("🔍 Debug - VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Present" : "Missing");
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log("❌ Supabase not configured, using empty data");
        setProjects([]);
        setWorkExperience([]);
        return;
      }
      
      console.log("✅ Supabase configured, fetching data...");

      // Mengambil data dari Supabase secara paralel
      const [projectsResponse, workExperienceResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: true }),
        supabase.from("work_experience").select("*").order('id', { ascending: true }), 
      ]);

      // Error handling untuk setiap request
      if (projectsResponse.error) throw projectsResponse.error;
      if (workExperienceResponse.error) throw workExperienceResponse.error;

      // Supabase mengembalikan data dalam properti 'data'
      const rawProjectData = projectsResponse.data || [];
      const rawWorkExperienceData = workExperienceResponse.data || [];

      // Parse Features and TechStack if they are JSON strings
      const projectData = rawProjectData.map(project => {
        let features = project.Features || [];
        let techStack = project.TechStack || [];
        
        // If they are strings, try to parse them as JSON
        if (typeof features === 'string') {
          try {
            features = JSON.parse(features);
          } catch (e) {
            console.error('Error parsing Features for project:', project.Title, e);
            features = [];
          }
        }
        
        if (typeof techStack === 'string') {
          try {
            techStack = JSON.parse(techStack);
          } catch (e) {
            console.error('Error parsing TechStack for project:', project.Title, e);
            techStack = [];
          }
        }
        
        return {
          ...project,
          Features: features,
          TechStack: techStack
        };
      });

      // Parse Achievements for work experience
      const workExperienceData = rawWorkExperienceData.map(work => {
        let achievements = work.Achievements || [];
        
        if (typeof achievements === 'string') {
          try {
            achievements = JSON.parse(achievements);
          } catch (e) {
            console.error('Error parsing Achievements for work:', work.Company, e);
            achievements = [];
          }
        }
        
        return {
          ...work,
          Achievements: achievements
        };
      });

      setProjects(projectData);
      setWorkExperience(workExperienceData);

      // Store in localStorage (fungsionalitas ini tetap dipertahankan)
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("work_experience", JSON.stringify(workExperienceData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);



  useEffect(() => {
    // Coba ambil dari localStorage dulu untuk laod lebih cepat
    const cachedProjects = localStorage.getItem('projects');
    const cachedWorkExperience = localStorage.getItem('work_experience');

    if (cachedProjects && cachedWorkExperience) {
        setProjects(JSON.parse(cachedProjects));
        setWorkExperience(JSON.parse(cachedWorkExperience));
    } else {
        // Add sample data if no cached data exists
        const sampleProjects = [
          {
            id: 1,
            Title: "Portfolio Website",
            Description: "Modern responsive portfolio built with React, showcasing projects and skills with beautiful animations.",
            Img: "/kabirsuriphoto.jpg",
            Link: "https://codingkabs.vercel.app",
            Github: "https://github.com/kabir505/Portfoliov2",
            Features: ["Responsive Design", "Modern UI/UX", "Smooth Animations", "Dark Theme"],
            TechStack: ["React", "Tailwind CSS", "Vite", "AOS"]
          }
        ];
        
        const sampleWorkExperience = [
          {
            id: 1,
            Company: "TP ICAP",
            Position: "Software Engineering Intern",
            Location: "London, UK",
            Duration: "Summer 2023",
            Description: "Worked on automation tools and scalable cloud systems, collaborating with cross-functional teams to deliver high-impact solutions.",
            Img: "/kabirsuriphoto.jpg",
            Achievements: ["Developed automation tools that reduced manual processes by 40%", "Collaborated on cloud infrastructure scaling", "Participated in agile development practices"]
          }
        ];
        
        setProjects(sampleProjects);
        setWorkExperience(sampleWorkExperience);
    }
    
    fetchData(); // Tetap panggil fetchData untuk sinkronisasi data terbaru
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllWorkExperience(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialProjects);
  const displayedWorkExperience = showAllWorkExperience ? workExperience : workExperience.slice(0, initialWorkExperience);

  // Sisa dari komponen (return statement) tidak ada perubahan
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      {/* <SupabaseTest /> */}
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            My Portfolio
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
        Discover my projects, achievements, and technical skills. Each piece represents my passion for creating innovative solutions.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Briefcase className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Work Experience"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Tech Stack"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <div>
          {value === 0 && (
            <TabPanel value={value} index={0}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      Github={project.Github}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialProjects && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>
          )}

          {value === 1 && (
            <TabPanel value={value} index={1}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedWorkExperience.map((work, index) => (
                  <div
                    key={work.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <WorkExperience
                      Img={work.Img}
                      Company={work.Company}
                      Position={work.Position}
                      Location={work.Location}
                      Duration={work.Duration}
                      Description={work.Description}
                      id={work.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {workExperience.length > initialWorkExperience && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('work_experience')}
                  isShowingMore={showAllWorkExperience}
                />
              </div>
            )}
          </TabPanel>
          )}

          {value === 2 && (
            <TabPanel value={value} index={2}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
          )}
        </div>
      </Box>
    </div>
  );
}