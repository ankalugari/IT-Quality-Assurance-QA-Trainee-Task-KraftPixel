
import React, { useState, useMemo } from 'react';
import { Project, Bug, Severity } from './types';
import Timer from './components/Timer';
import AddBugForm from './components/AddBugForm';
import AIAssistant from './components/AIAssistant';
import { PlusIcon, TrashIcon, DownloadIcon } from './components/Icons';

const initialProjects: Project[] = [
  {
    id: 'angelone',
    name: 'Angel One - Reliance',
    url: 'https://www.angelone.in/stocks/reliance-industries-ltd',
  },
  {
    id: 'iifl',
    name: 'India Infoline News',
    url: 'https://www.indiainfoline.com/news',
  },
];

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
    const colorClasses: Record<Severity, string> = {
        [Severity.Critical]: 'bg-red-500/20 text-red-400 border-red-500/30',
        [Severity.High]: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        [Severity.Medium]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        [Severity.Low]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colorClasses[severity]}`}>
            {severity}
        </span>
    );
};


const BugCard: React.FC<{ bug: Bug; onDelete: (id: string) => void }> = ({ bug, onDelete }) => {
    return (
        <div className="bg-base-200 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-content-100 mb-2">{bug.title}</h4>
                <SeverityBadge severity={bug.severity} />
            </div>
            <p className="text-content-200 mb-4">{bug.description}</p>
            <div className="text-right">
                <button 
                    onClick={() => onDelete(bug.id)}
                    className="p-1 text-content-200 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                    title="Delete bug"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

const ProjectSidebar: React.FC<{ 
    projects: Project[]; 
    selectedProjectId: string | null; 
    onSelectProject: (id: string) => void;
}> = ({ projects, selectedProjectId, onSelectProject }) => {
    return (
        <aside className="bg-base-200 p-4 md:p-6 flex flex-col space-y-6">
            <h1 className="text-2xl font-bold text-content-100 text-center">QA Assistant</h1>
            <Timer />
            <div>
                <h2 className="text-lg font-semibold mb-3 text-content-100">Projects</h2>
                <ul className="space-y-2">
                    {projects.map((project) => (
                        <li key={project.id}>
                            <button
                                onClick={() => onSelectProject(project.id)}
                                className={`w-full text-left p-3 rounded-md transition ${
                                    selectedProjectId === project.id
                                    ? 'bg-brand-primary text-white font-semibold shadow-lg'
                                    : 'bg-base-300 hover:bg-brand-secondary hover:text-white'
                                }`}
                            >
                                {project.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="bg-base-300 p-4 rounded-lg text-sm space-y-2 flex-grow">
                <h3 className="font-bold text-content-100">Instructions</h3>
                <p>1. Select a project to test.</p>
                <p>2. Use the "AI Assistant" to find potential bugs.</p>
                <p>3. Add any bugs you find manually.</p>
                <p>4. Export your findings when done.</p>
                <p>5. Complete within the 1-hour time limit.</p>
            </div>
        </aside>
    );
};


const App: React.FC = () => {
  const [projects] = useState<Project[]>(initialProjects);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjects[0]?.id || null);
  const [isAddingBug, setIsAddingBug] = useState(false);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const filteredBugs = useMemo(() => {
    return bugs
      .filter((bug) => bug.projectId === selectedProjectId)
      .sort((a, b) => Object.values(Severity).indexOf(a.severity) - Object.values(Severity).indexOf(b.severity));
  }, [bugs, selectedProjectId]);

  const handleAddBug = (newBugData: Omit<Bug, 'id' | 'projectId'>) => {
    if (!selectedProjectId) return;
    const newBug: Bug = {
      ...newBugData,
      id: `bug-${Date.now()}`,
      projectId: selectedProjectId,
    };
    setBugs([...bugs, newBug]);
    setIsAddingBug(false);
  };

  const handleDeleteBug = (bugId: string) => {
    setBugs(bugs.filter((bug) => bug.id !== bugId));
  };

  const handleExportBugs = () => {
    if (!selectedProject) return;
    
    let content = `Bug Report for: ${selectedProject.name}\n`;
    content += `URL: ${selectedProject.url}\n`;
    content += `Date: ${new Date().toISOString()}\n\n`;
    content += '-----------------------------------------\n\n';

    if (filteredBugs.length === 0) {
        content += "No bugs found for this project.\n";
    } else {
        filteredBugs.forEach((bug, index) => {
            content += `#${index + 1}: ${bug.title}\n`;
            content += `Severity: ${bug.severity}\n`;
            content += `Description: ${bug.description}\n\n`;
        });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bug_report_${selectedProject.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 lg:grid-cols-10">
      <div className="md:col-span-4 lg:col-span-3">
        <ProjectSidebar 
            projects={projects} 
            selectedProjectId={selectedProjectId} 
            onSelectProject={setSelectedProjectId}
        />
      </div>
      
      <main className="md:col-span-8 lg:col-span-7 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {selectedProject ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-content-100">{selectedProject.name}</h2>
                    <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline break-all">
                        {selectedProject.url}
                    </a>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleExportBugs}
                        className="px-4 py-2 bg-base-300 text-content-100 font-semibold rounded-md hover:bg-opacity-80 transition flex items-center"
                    >
                        <DownloadIcon /> Export
                    </button>
                    <button
                        onClick={() => setIsAddingBug(!isAddingBug)}
                        className="px-4 py-2 bg-brand-secondary text-white font-semibold rounded-md hover:bg-brand-primary transition flex items-center"
                    >
                        <PlusIcon /> <span className="hidden sm:inline ml-2">Add Bug</span>
                    </button>
                </div>
            </div>

            {isAddingBug && (
              <AddBugForm onAddBug={handleAddBug} onCancel={() => setIsAddingBug(false)} />
            )}
            
            <AIAssistant projectUrl={selectedProject.url} onAddBug={handleAddBug} />

            <div className="space-y-4">
              {filteredBugs.length > 0 ? (
                filteredBugs.map((bug) => (
                  <BugCard key={bug.id} bug={bug} onDelete={handleDeleteBug} />
                ))
              ) : (
                <div className="text-center py-16 px-6 bg-base-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-content-100">No bugs reported yet.</h3>
                    <p className="text-content-200 mt-2">Start by using the AI Assistant or adding a bug manually.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-content-200">Select a project to start.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
