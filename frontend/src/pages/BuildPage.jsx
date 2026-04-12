import { Link } from "react-router-dom";
import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/DevShowcaseLogo4.png";
import templateImage from "../assets/TemplateImage.png";
import githubLogo from "../assets/ConnectGithubImage.png";
import urlIcon from "../assets/CleanLinkImage.png";
import tempHeadshot from "../assets/BlankProfile.png";

export default function BuildPage() {
    // Clerk hooks to grab the token and check auth status
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [backendResponse, setBackendResponse] = useState(null);
    const navigate = useNavigate();
    const { user } = useUser();
    const [activePage, setActivePage] = useState("projects");
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [projectInputMode, setProjectInputMode] = useState("github");
    const [activeImageIndexes, setActiveImageIndexes] = useState({});
    

    const [manualProject, setManualProject] = useState({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        technologies: "",
        mediaType: "youtube",
        youtubeUrl: "",
        images: [],
    });

    const [portfolioData, setPortfolioData] = useState({
        template: "classic",
        primaryColor: "#09c1de",
        secondaryColor: "#47e4b0",
        about: {
            headshot: null,
            name: "",
            year: "",
            college: "",
            major: "",
            paragraph: "",
            resume: null,
        },
        projects: [],
        involvement: {
            education: "",
            clubs: [],
            certifications: [],
            other: "",
        },
    });
    const selectedTemplate = portfolioData.template;
    const primaryColor = portfolioData.primaryColor;
    const secondaryColor = portfolioData.secondaryColor;

    // --- NEW: SAVE TO MONGODB FUNCTION ---
    const savePortfolio = async () => {
        try {
            const token = await getToken();
            const response = await fetch("http://localhost:8080/save-portfolio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(portfolioData)
            });
            const data = await response.json();
            alert(data.message);
            setBackendResponse(data);
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save build to database. Check if your backend is running.");
        }
    };

    const testBackend = async () => {
        try {
            const token = await getToken();
            console.log("Token generated:", token); 
            const response = await fetch("http://localhost:8080/protected", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            setBackendResponse(data);
        } catch (error) {
            console.error("Failed to fetch:", error);
            setBackendResponse({ error: "Failed to connect to backend. Is your FastAPI server running?" });
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regExp);
        return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    };

    if (!isLoaded) {
        return <div className="p-10 text-white min-h-screen bg-[rgb(25,25,25)]">Loading Clerk...</div>;
    }

    if (!isSignedIn) {
        return (
            <div className="p-10 text-white min-h-screen bg-[rgb(25,25,25)] flex flex-col items-center justify-center">
                <h2 className="text-2xl mb-4 font-semibold">You must be signed in to view the builder!</h2>
                <button 
                    onClick={() => navigate('/sign-in')} 
                    className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-lg font-bold transition-colors"
                >
                    Go to Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden text-white bg-[rgb(25,25,25)]">
            <aside className="w-64 h-full overflow-hidden border-r border-gray-700 flex flex-col p-4">
                <div className="mb-6 pb-0 space-y-3">
                    <Link className="flex items-center" to="/">
                        <img src={logo} className="h-12 w-auto"/>
                    </Link>
                    
                    <div className="mt-2">
                        <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wide">
                            Templates
                        </h2>
                        <div className="flex flex-col items-center pt-2 pb-2 gap-1">
                            <div
                                onClick={() => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        template: "classic",
                                    })
                                }
                                className={`flex cursor-pointer flex-col items-center p-1 rounded-xl ${
                                    selectedTemplate === "classic" ? "bg-[rgba(9,173,245,.5)] border border-[rgba(11,209,244,0.45)]" : "bg-transparent border border-transparent"
                                }`}
                            >
                                <img src={templateImage} className="w-48"/>
                                <p className={`text-sm font-semibold ${selectedTemplate === "classic" ? "text-gray-100" : "text-gray-400"}`}>Classic</p>
                            </div>

                            <div
                                onClick={() => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        template: "minimalist",
                                    })
                                }
                                className={`flex cursor-pointer flex-col items-center p-1 rounded-xl ${
                                    selectedTemplate === "minimalist" ? "bg-[rgba(9,173,245,.5)] border border-cyan-200" : "bg-transparent border border-transparent"
                                }`}
                            >
                                <img src={templateImage} className="w-48"/>
                                <p className={`text-sm font-semibold ${selectedTemplate === "minimalist" ? "text-gray-100" : "text-gray-400"}`}>Minimalist</p>
                            </div>

                            <div
                                onClick={() => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        template: "technical",
                                    })
                                }
                                className={`flex cursor-pointer flex-col items-center p-1 rounded-xl ${
                                    selectedTemplate === "technical" ? "bg-[rgba(9,173,245,.5)] border border-cyan-200" : "bg-transparent border border-transparent"
                                }`}
                            >
                                <img src={templateImage} className="w-48"/>
                                <p className={`text-sm font-semibold ${selectedTemplate === "technical" ? "text-gray-100" : "text-gray-400"}`}>Technical</p>
                            </div>
                        </div>
                        
                        <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wide pt-1">
                            Accent Colors
                        </h2>
                        <div className="flex gap-4 items-center justify-between px-6 mt-4">
                            <p className="text-sm font-semibold text-gray-400">Primary</p>
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        primaryColor: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex gap-4 items-center justify-between px-6 mt-4">
                            <p className="text-sm font-semibold text-gray-400">Secondary</p>
                            <input
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => 
                                    setPortfolioData({
                                        ...portfolioData,
                                        secondaryColor: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="pt-5 px-2 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={savePortfolio}
                                    className="rounded-xl border border-cyan-600 bg-[rgb(35,35,35)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                                >
                                    Save
                                </button>

                                <button
                                    className="rounded-xl border border-cyan-600 bg-[rgb(35,35,35)] px-4 py-2 font-semibold text-white transition hover:bg-[rgb(45,45,45)]"
                                >
                                    Preview
                                </button>
                            </div>

                            <button
                                className="w-full rounded-xl bg-cyan-600 px-4 py-2.5 font-bold text-white transition hover:bg-cyan-500 active:scale-[0.98]"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-auto">
                    <div className="flex items-center gap-5 pl-2 pb-2">
                        <UserButton afterSignOutUrl="/" appearance={{ 
                            baseTheme: dark ,
                            elements: {userButtonTrigger: "scale-125 origin-left"}
                            }} />
                        <span className="text-lg font-semibold text-white">
                            {user?.fullName || user?.firstName || "User"}
                        </span>
                    </div>
                </div>
            </aside>
            
            <main className="flex-1 h-full overflow-hidden p-8 bg-[rgb(35,35,35)]">
                <div className="h-full overflow-y-auto rounded-2xl border border-gray-700 bg-[rgb(25,25,25)]">
                        <div className="sticky top-0 z-20 flex justify-center px-6 py-4 bg-transparent">
                            <div className="relative rounded-full border border-white/10 bg-white/8 backdrop-blur-md">
                                <div 
                                    className="absolute top-0 z-0 h-full w-1/3 rounded-full transition-all duration-300"
                                    style={{
                                        left:
                                            activePage === "about" ? "0%" : activePage === "projects" ? "27%" : "58%",
                                        width:
                                            activePage === "about" ? "26.5%" : activePage === "projects" ? "30%" : "41.5%",
                                        background: primaryColor,
                                    }}
                                ></div>
                                <button
                                    onClick={() => setActivePage("about")}
                                    className={`relative z-10 rounded-full px-4 py-2 font-medium ${
                                        activePage === "about" ? "text-white" : "text-gray-300"
                                    }`}
                                >
                                    About
                                </button>

                                <button
                                    onClick={() => setActivePage("projects")}
                                    className={`relative z-10 rounded-full px-4 py-2 font-medium ${
                                        activePage === "projects" ? "text-white" : "text-gray-300"
                                    }`}
                                >
                                    Projects
                                </button>

                                <button
                                    onClick={() => setActivePage("involvement")}
                                    className={`relative z-10 rounded-full px-4 py-2 font-medium ${
                                        activePage === "involvement" ? "text-white" : "text-gray-300"
                                    }`}
                                >
                                    Involvement
                                </button>
                            </div>
                        </div>
                        
                        {activePage === "about" && selectedTemplate === "classic" && (
                            <div className="p-0">
                                <div className="mt-2 flex gap-2 max-w-4xl mx-auto justify-center items-center">
                                    <div className="flex h-72 w-72 items-center justify-center rounded-full border border-gray-700 bg-[rgb(35,35,35)] text-sm text-gray-400 overflow-hidden">
                                        {portfolioData.about.headshot ? (
                                            <img
                                                src={URL.createObjectURL(portfolioData.about.headshot)}
                                                alt={tempHeadshot}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={tempHeadshot}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="pl-8 pt-24 text-5xl font-bold text-white">
                                            {portfolioData.about.name || "Your Name"}
                                        </h2>

                                        <div className="pl-9 flex gap-1 text-lg" style={{ color: secondaryColor }}>
                                            <p className="italic">{portfolioData.about.year || "Year"}</p>
                                            <p className="italic">{portfolioData.about.major || "Major"}</p>
                                            <p>student at</p>
                                            <p className="italic">{portfolioData.about.college || "College"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 -mt-14 bg-[rgb(40,40,40)] p-12 border-t-6 text-gray-400 text-justify" style={{ color: primaryColor }}>
                                    <div className="max-w-5xl mx-auto">
                                        <h2 className="text-2xl font-bold text-white">About Me</h2>
                                        <p className="mt-4 text-lg text-gray-400">{portfolioData.about.bio || "Your bio goes here."}</p>
                                        {portfolioData.about.resume && (
                                            <div className="mt-8">
                                                <iframe
                                                    src={URL.createObjectURL(portfolioData.about.resume)}
                                                    title="Resume Preview"
                                                    className="h-[1130px] w-full rounded-2xl border border-gray-700 bg-white"
                                                />
                                            </div>
                                        )}
                                        <input
                                            id="resumeUpload"
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file && file.type === "application/pdf") {
                                                    setPortfolioData({
                                                        ...portfolioData,
                                                        about: {
                                                            ...portfolioData.about,
                                                            resume: file,
                                                        },
                                                    });
                                                }
                                            }}
                                        />
                                        <div
                                            onClick={() => document.getElementById("resumeUpload").click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files?.[0];
                                                if (file && file.type === "application/pdf") {
                                                    setPortfolioData({
                                                        ...portfolioData,
                                                        about: {
                                                            ...portfolioData.about,
                                                            resume: file,
                                                        },
                                                    });
                                                }
                                            }}
                                            className="flex mt-6 min-h-32 w-full mx-auto items-center justify-center rounded-2xl border-2 border-dashed border-gray-600 bg-[rgb(35,35,35)] p-6 text-center text-gray-400"
                                        >
                                            {portfolioData.about.resume
                                                ? portfolioData.about.resume.name
                                                : "Drag and drop your resume PDF here"}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                        {activePage === "projects" && selectedTemplate === "classic" && (
                            <div className="p-0">
                                <div className="mt-6">
                                    {portfolioData.projects.map((project, index) => {
                                        const hasMedia = (project.mediaType === "images" && project.images?.length > 0) || (project.mediaType === "youtube" && project.youtubeUrl);
                                        return (
                                            <div
                                                key={project.id}
                                                className={`group relative grid grid-cols-2 gap-8 p-8 ${
                                                    index % 2 === 1 ? "bg-[rgb(40,40,40)]" : "bg-[rgb(25,25,25)]"
                                                }`}
                                            >
                                                <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
                                                    <button
                                                        onClick={() => {
                                                            setEditingProjectId(project.id);
                                                            setManualProject({
                                                                title: project.title || "",
                                                                description: project.description || "",
                                                                githubUrl: project.githubUrl || "",
                                                                liveUrl: project.liveUrl || "",
                                                                technologies: project.technologies || "",
                                                                mediaType: project.mediaType || "youtube",
                                                                youtubeUrl: project.youtubeUrl || "",
                                                                images: project.images || [],
                                                            });
                                                            setProjectInputMode("manual");
                                                            setIsAddProjectOpen(true);
                                                        }}
                                                        className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm hover:bg-black/60"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setPortfolioData({
                                                                ...portfolioData,
                                                                projects: portfolioData.projects.filter((p) => p.id !== project.id),
                                                            })
                                                        }
                                                        className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm text-red-300 backdrop-blur-sm hover:bg-red-500/20"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                                <div className={`flex flex-col justify-center ${hasMedia ? (index % 2 === 1 ? "pr-8 order-2" : "pl-8 order-1") : "col-span-2 max-w-5xl mx-auto"}`}>
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-2xl font-bold text-white">
                                                            {project.title || `Project ${index + 1}`}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            {project.githubUrl && (
                                                                <a
                                                                    href={project.githubUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                                >
                                                                    <img src={githubLogo} className="h-7 w-7" />
                                                                </a>
                                                            )}
                                                            {project.liveUrl && (
                                                                <a
                                                                    href={project.liveUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:scale-105 hover:bg-white/12"
                                                                >
                                                                    <img src={urlIcon} className="h-6 w-6" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {project.description && (
                                                        <p className="mt-3 text-base leading-7 text-gray-400 text-justify">{project.description}</p>
                                                    )}
                                                    {project.technologies && (
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            {project.technologies.split(",").map((tech, techIndex) => (
                                                                <span
                                                                    key={techIndex}
                                                                    className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm"
                                                                    style={{ color: secondaryColor }}
                                                                >
                                                                    {tech.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`flex flex-col justify-center ${index % 2 === 1 ? "items-center order-1" : "items-center order-2"}`}>
                                                    {project.mediaType === "youtube" && project.youtubeUrl && (
                                                        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-700 bg-[rgb(20,20,20)]">
                                                            <iframe
                                                                src={getYouTubeEmbedUrl(project.youtubeUrl)}
                                                                title={`${project.title || "Project"} video`}
                                                                className="aspect-video w-full"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                    )}
                                                    {project.mediaType === "images" && project.images?.length > 0 && (
                                                        <div className="w-full max-w-xl">
                                                            {(() => {
                                                                const currentIndex = activeImageIndexes[project.id] || 0;
                                                                const prevIndex = currentIndex === 0 ? project.images.length - 1 : currentIndex - 1;
                                                                const nextIndex = currentIndex === project.images.length - 1 ? 0 : currentIndex + 1;
                                                                return (
                                                                    <div className="relative">
                                                                        <img
                                                                            src={URL.createObjectURL(project.images[currentIndex])}
                                                                            alt="Project preview"
                                                                            className="h-72 w-full rounded-2xl object-cover border border-gray-700"
                                                                        />

                                                                        {project.images.length > 1 && (
                                                                            <div>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        setActiveImageIndexes({
                                                                                            ...activeImageIndexes,
                                                                                            [project.id]: prevIndex,
                                                                                        })
                                                                                    }
                                                                                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                                                                                >
                                                                                    ←
                                                                                </button>

                                                                                <button
                                                                                    onClick={() =>
                                                                                        setActiveImageIndexes({
                                                                                            ...activeImageIndexes,
                                                                                            [project.id]: nextIndex,
                                                                                        })
                                                                                    }
                                                                                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                                                                                >
                                                                                    →
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <button
                                        onClick={() => {
                                            setEditingProjectId(null);
                                            setIsAddProjectOpen(true);
                                        }}
                                        className={`w-full text-xl p-8 cursor-pointer ${
                                            portfolioData.projects.length % 2 === 1 ? "bg-[rgb(40,40,40)] border-none" : "bg-[rgb(25,25,25)] border-b border-gray-700"
                                        }`}
                                    >
                                        + Add Project
                                    </button>
                                </div>
                            </div>
                        )}
                        {isAddProjectOpen && (
                            <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div className="w-full max-w-2xl rounded-2xl bg-[rgb(25,25,25)] px-6 pb-6 pt-2 border border-gray-700">
                                    <div className="flex items-center pb-4">
                                        <button
                                            onClick={() => {
                                                setIsAddProjectOpen(false);
                                                setEditingProjectId(null);
                                                setManualProject({
                                                    title: "",
                                                    description: "",
                                                    githubUrl: "",
                                                    liveUrl: "",
                                                    technologies: "",
                                                    mediaType: "youtube",
                                                    youtubeUrl: "",
                                                    images: [],
                                                });
                                            }}
                                            className="text-2xl text-gray-400 hover:text-white"
                                        >
                                            ×
                                        </button>

                                        {editingProjectId !== null ? (
                                            <div className="flex flex-1 justify-center">
                                                <h2 className="text-lg font-semibold border-b-2 border-cyan-500 text-white">Edit Project</h2>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 justify-center gap-4">
                                                <button
                                                    onClick={() => setProjectInputMode("github")}
                                                    className={`px-4 py-2 font-medium ${
                                                        projectInputMode === "github"
                                                            ? "border-b-2 border-cyan-500 text-white"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    Import from GitHub
                                                </button>

                                                <button
                                                    onClick={() => setProjectInputMode("manual")}
                                                    className={`px-4 py-2 font-medium ${
                                                        projectInputMode === "manual"
                                                            ? "border-b-2 border-cyan-500 text-white"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    Enter Manually
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-gray-700">
                                        {projectInputMode === "github" ? (
                                            <div className="space-y-3">
                                                <div className="rounded-xl border border-gray-700 p-4 text-gray-400">
                                                    Connected repositories will go here
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Project Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter project title"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                        value={manualProject.title}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                title: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                                    <textarea
                                                        placeholder="Enter project description"
                                                        rows={4}
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none resize-none"
                                                        value={manualProject.description}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">GitHub URL</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Paste GitHub repository link"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                        value={manualProject.githubUrl}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                githubUrl: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Live URL</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Paste deployed project link"
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                        value={manualProject.liveUrl}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                liveUrl: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Technologies</label>
                                                    <input
                                                        type="text"
                                                        placeholder="React, Tailwind, FastAPI, etc."
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                        value={manualProject.technologies}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                technologies: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Media Type</label>
                                                    <select
                                                        className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white outline-none"
                                                        value={manualProject.mediaType}
                                                        onChange={(e) =>
                                                            setManualProject({
                                                                ...manualProject,
                                                                mediaType: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="youtube">YouTube Video</option>
                                                        <option value="images">Images</option>
                                                    </select>
                                                </div>

                                                {manualProject.mediaType === "youtube" && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-300">YouTube URL</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Paste YouTube link"
                                                            className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white placeholder-gray-500 outline-none"
                                                            value={manualProject.youtubeUrl}
                                                            onChange={(e) =>
                                                                setManualProject({
                                                                    ...manualProject,
                                                                    youtubeUrl: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                {manualProject.mediaType === "images" && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-300">Upload Images</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="w-full rounded-lg border border-gray-700 bg-[rgb(35,35,35)] px-4 py-2 text-white file:mr-4 file:rounded-md file:border-0 file:bg-cyan-600 file:px-3 file:py-1 file:text-white"
                                                            onChange={(e) =>
                                                                setManualProject({
                                                                    ...manualProject,
                                                                    images: Array.from(e.target.files || []),
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex justify-end gap-3 pt-2">
                                                    <button
                                                        className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-800"
                                                        onClick={() => {
                                                            setIsAddProjectOpen(false);
                                                            setEditingProjectId(null);
                                                            setManualProject({
                                                                title: "",
                                                                description: "",
                                                                githubUrl: "",
                                                                liveUrl: "",
                                                                technologies: "",
                                                            });
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500"
                                                        onClick={() => {
                                                            if (editingProjectId !== null) {
                                                                setPortfolioData({
                                                                    ...portfolioData,
                                                                    projects: portfolioData.projects.map((project) =>
                                                                        project.id === editingProjectId
                                                                            ? {
                                                                                ...project,
                                                                                ...manualProject,
                                                                            }
                                                                            : project
                                                                    ),
                                                                });
                                                            } else {
                                                                setPortfolioData({
                                                                    ...portfolioData,
                                                                    projects: [
                                                                        ...portfolioData.projects,
                                                                        {
                                                                            id: crypto.randomUUID(),
                                                                            ...manualProject,
                                                                        },
                                                                    ],
                                                                });
                                                            }

                                                            setIsAddProjectOpen(false);
                                                            setEditingProjectId(null);
                                                            setManualProject({
                                                                title: "",
                                                                description: "",
                                                                githubUrl: "",
                                                                liveUrl: "",
                                                                technologies: "",
                                                                mediaType: "youtube",
                                                                youtubeUrl: "",
                                                                images: [],
                                                            });
                                                        }}
                                                    >
                                                        {editingProjectId !== null ? "Update Project" : "Save Project"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePage === "involvement" && selectedTemplate === "classic" && (
                            <div className="p-8">
                                <h1 className="text-2xl font-bold text-white">Involvement</h1>
                            </div>
                        )}

                
                    {/* <button 
                        onClick={testBackend}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Test Backend Connection
                    </button>
                    
                    {backendResponse && (
                        <div className="mt-8 p-6 bg-[rgb(35,35,35)] rounded-xl border border-gray-600 shadow-lg max-w-2xl">
                            <h2 className="text-xl mb-4 font-semibold text-gray-300">FastAPI Response:</h2>
                            <pre className="text-green-400 overflow-x-auto text-sm">
                                {JSON.stringify(backendResponse, null, 2)}
                            </pre>
                        </div>
                    )} */}
                </div>
            </main>
            
        </div>
    );
}