
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { format, addDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Mock data for team members
const teamMembers = [
  { id: 1, name: "Alex Chen", role: "Team Lead" },
  { id: 2, name: "Jamie Rivera", role: "Frontend Developer" },
  { id: 3, name: "Taylor Kim", role: "Backend Developer" },
  { id: 4, name: "Morgan Patel", role: "UI/UX Designer" },
  { id: 5, name: "Casey Thompson", role: "QA Engineer" },
];

// Sprint definitions
const sprints = [
  { 
    id: 1, 
    name: "Sprint 1", 
    startDay: 1, 
    endDay: 10, 
    focus: "Research & Planning",
    goals: "Market research, user personas, tech stack decisions, basic project setup"
  },
  { 
    id: 2, 
    name: "Sprint 2", 
    startDay: 11, 
    endDay: 20, 
    focus: "Core Functionality",
    goals: "Authentication, basic task management, UI components library"
  },
  { 
    id: 3, 
    name: "Sprint 3", 
    startDay: 21, 
    endDay: 30, 
    focus: "Advanced Features",
    goals: "Calendar integration, analytics dashboard, notifications system"
  },
  { 
    id: 4, 
    name: "Sprint 4", 
    startDay: 31, 
    endDay: 40, 
    focus: "Polish & Launch",
    goals: "Performance optimization, bug fixes, final UI refinements, deployment"
  },
];

// Generate standup data for each team member for 40 days
const generateStandupData = () => {
  const startDate = new Date(2023, 5, 1); // June 1, 2023
  const standupData = [];

  for (let day = 1; day <= 40; day++) {
    const currentDate = addDays(startDate, day - 1);
    const sprintInfo = sprints.find(sprint => day >= sprint.startDay && day <= sprint.endDay);
    
    const dayEntry = {
      day,
      date: format(currentDate, "PPP"),
      sprintId: sprintInfo?.id,
      sprintName: sprintInfo?.name,
      teamUpdates: teamMembers.map(member => {
        return generateMemberUpdate(member, day, sprintInfo);
      }),
      dailySummary: generateDailySummary(day, sprintInfo),
    };
    
    standupData.push(dayEntry);
  }
  
  return standupData;
};

// Generate a specific update for a team member based on the day and sprint
const generateMemberUpdate = (member, day, sprint) => {
  const updates = {
    // Team Lead updates
    1: {
      1: {
        yesterday: "Conducted market research on task management apps",
        today: "Creating project scope document and user personas",
        blockers: "None at the moment"
      },
      2: {
        yesterday: "Defined user stories and created task breakdown",
        today: "Planning sprint structure and team workflow",
        blockers: "Waiting for feedback on requirements doc"
      },
      3: {
        yesterday: "Finalized project architecture decisions",
        today: "Setting up project repositories and documentation",
        blockers: "None at the moment"
      },
      4: {
        yesterday: "Reviewing deployment options and costs",
        today: "Finalizing first sprint backlog items",
        blockers: "None"
      }
    },
    // Frontend Developer updates
    2: {
      1: {
        yesterday: "Researched UI component libraries for the project",
        today: "Testing ShadCN/UI components with our design needs",
        blockers: "None"
      },
      2: {
        yesterday: "Evaluating React state management options",
        today: "Creating proof-of-concept for UI components",
        blockers: "Need design mockups from Morgan"
      },
      3: {
        yesterday: "Setting up Vite + React + TypeScript environment",
        today: "Creating project folder structure and base components",
        blockers: "None"
      },
      4: {
        yesterday: "Implementing theme provider and global styles",
        today: "Building responsive layout components",
        blockers: "None"
      }
    },
    // Backend Developer updates
    3: {
      1: {
        yesterday: "Researched data storage options for tasks",
        today: "Designing database schema for user and task data",
        blockers: "None"
      },
      2: {
        yesterday: "Evaluating authentication approaches for the app",
        today: "Creating data models and relationship diagrams",
        blockers: "Waiting for final requirements"
      },
      3: {
        yesterday: "Setting up mock API service",
        today: "Implementing data persistence layer",
        blockers: "None"
      },
      4: {
        yesterday: "Researching efficient date handling libraries",
        today: "Setting up local storage persistence for tasks",
        blockers: "None"
      }
    },
    // UI/UX Designer updates
    4: {
      1: {
        yesterday: "Conducted competitive analysis of task management UIs",
        today: "Creating user journey maps for core workflows",
        blockers: "None"
      },
      2: {
        yesterday: "Sketching wireframes for dashboard layout",
        today: "Designing task list and form components",
        blockers: "Waiting for user persona finalization"
      },
      3: {
        yesterday: "Creating color palette and typography system",
        today: "Designing responsive layouts for all views",
        blockers: "None"
      },
      4: {
        yesterday: "Finalizing UI component design system",
        today: "Creating high-fidelity mockups for dashboard",
        blockers: "Need feedback on wireframes"
      }
    },
    // QA Engineer updates
    5: {
      1: {
        yesterday: "Researched testing frameworks for React applications",
        today: "Setting up test environment configuration",
        blockers: "None"
      },
      2: {
        yesterday: "Creating test plan for the application",
        today: "Defining acceptance criteria for user stories",
        blockers: "Waiting for requirement finalization"
      },
      3: {
        yesterday: "Setting up CI pipeline for tests",
        today: "Writing test cases for core functionality",
        blockers: "None"
      },
      4: {
        yesterday: "Creating testing templates and documentation",
        today: "Planning end-to-end testing strategy",
        blockers: "None"
      }
    }
  };

  // Progress mapping for each sprint
  const sprintProgress = {
    1: [
      // Sprint 1 - Research & Planning
      {
        1: "Starting market research and competitor analysis",
        2: "Exploring UI component libraries and design systems",
        3: "Researching database options and data structures",
        4: "Analyzing user experience of existing task apps",
        5: "Setting up testing framework architecture"
      },
      {
        1: "Defining project scope and requirements",
        2: "Creating sample UI components with ShadCN",
        3: "Designing initial database schema",
        4: "Creating first wireframes for dashboard",
        5: "Developing test plan documentation"
      },
      {
        1: "Finalizing user personas and stories",
        2: "Setting up React + TypeScript environment",
        3: "Prototyping task data models",
        4: "Designing task creation flow",
        5: "Defining quality metrics for the application"
      },
      {
        1: "Creating sprint plan and backlog",
        2: "Implementing basic routing structure",
        3: "Researching local storage optimization",
        4: "Finalizing color palette and typography",
        5: "Setting up automated test environment"
      },
      {
        1: "Researching calendar integration options",
        2: "Setting up project state management",
        3: "Building data fetching utility functions",
        4: "Creating component design system",
        5: "Writing first test cases for auth flow"
      },
      {
        1: "Meeting with stakeholders for requirements",
        2: "Building auth UI components",
        3: "Implementing auth context provider",
        4: "Designing analytics dashboard mockups",
        5: "Setting up test data generators"
      },
      {
        1: "Finalizing technology stack decisions",
        2: "Creating landing page design",
        3: "Building user model and hooks",
        4: "Designing mobile responsive layouts",
        5: "Creating test scenarios for task management"
      },
      {
        1: "Creating project roadmap and milestones",
        2: "Building UI component library",
        3: "Implementing data storage utilities",
        4: "Finalizing wireframes for all pages",
        5: "Developing integration test plan"
      },
      {
        1: "Sprint 1 review preparation",
        2: "Implementing responsive layout framework",
        3: "Completing API service layer",
        4: "Creating high-fidelity mockups",
        5: "Finishing initial test harness setup"
      },
      {
        1: "Sprint 1 review and retrospective",
        2: "Documentation for UI components",
        3: "Preparing for core feature development",
        4: "Delivering design assets for development",
        5: "Validating test environment with team"
      }
    ],
    2: [
      // Sprint 2 - Core Functionality
      {
        1: "Planning Sprint 2 tasks and assignments",
        2: "Starting on authentication UI development",
        3: "Implementing user authentication logic",
        4: "Refining task form designs",
        5: "Testing authentication flows"
      },
      {
        1: "Monitoring team progress on core features",
        2: "Building login and registration forms",
        3: "Creating task data models and context",
        4: "Designing priority indicators and badges",
        5: "Writing test cases for task operations"
      },
      {
        1: "Reviewing authentication implementation",
        2: "Implementing form validation",
        3: "Building task creation functionality",
        4: "Creating animated transitions between views",
        5: "Testing form validation logic"
      },
      {
        1: "Addressing team blockers on task management",
        2: "Building task list component",
        3: "Implementing task filtering and sorting",
        4: "Designing notification components",
        5: "Creating test fixtures for tasks"
      },
      {
        1: "Meeting with stakeholders for progress update",
        2: "Implementing dashboard layout",
        3: "Building task update and delete functions",
        4: "Refining hover and focus states",
        5: "Testing task CRUD operations"
      },
      {
        1: "Planning for mid-sprint demo",
        2: "Creating task priority visualization",
        3: "Implementing local storage persistence",
        4: "Designing calendar integration UI",
        5: "Performing usability testing on core flows"
      },
      {
        1: "Conducting mid-sprint review",
        2: "Building responsive mobile navigation",
        3: "Implementing task status toggles",
        4: "Creating loading and empty states",
        5: "Testing multi-device compatibility"
      },
      {
        1: "Addressing feedback from mid-sprint review",
        2: "Implementing toast notifications",
        3: "Building task statistics calculation",
        4: "Designing analytics charts and graphs",
        5: "Regression testing after fixes"
      },
      {
        1: "Preparing for Sprint 2 demo",
        2: "Polishing UI details and transitions",
        3: "Finalizing core data management",
        4: "Creating user onboarding designs",
        5: "Completing test coverage for core features"
      },
      {
        1: "Sprint 2 review and retrospective",
        2: "Documenting component usage",
        3: "Preparing for advanced features",
        4: "Gathering user feedback on current UI",
        5: "Reporting on quality metrics and improvements"
      }
    ],
    3: [
      // Sprint 3 - Advanced Features
      {
        1: "Planning Sprint 3 scope and timelines",
        2: "Starting calendar view implementation",
        3: "Building notification system backend",
        4: "Designing analytics visualizations",
        5: "Testing performance benchmarks"
      },
      {
        1: "Coordinating calendar integration work",
        2: "Implementing date picker and selection",
        3: "Creating task analytics calculations",
        4: "Refining data visualization components",
        5: "Writing test scripts for analytics"
      },
      {
        1: "Reviewing calendar implementation",
        2: "Building task calendar day view",
        3: "Implementing task statistics aggregation",
        4: "Creating adaptive color schemes for charts",
        5: "Testing notification delivery"
      },
      {
        1: "Addressing blockers for notification system",
        2: "Implementing task scheduling features",
        3: "Building completion rate calculations",
        4: "Designing filter and sorting controls",
        5: "Performance testing on large task sets"
      },
      {
        1: "Conducting mid-sprint status meeting",
        2: "Creating drag-and-drop task scheduling",
        3: "Implementing dashboard statistics widgets",
        4: "Refining responsive layouts for analytics",
        5: "Usability testing of calendar features"
      },
      {
        1: "Meeting with stakeholders for feedback",
        2: "Building recurring task options",
        3: "Implementing chart generation functions",
        4: "Creating printable report designs",
        5: "Testing analytics accuracy"
      },
      {
        1: "Planning feature showcase for team",
        2: "Implementing notification preference UI",
        3: "Building task trend analysis functions",
        4: "Designing onboarding tooltips",
        5: "Cross-browser compatibility testing"
      },
      {
        1: "Reviewing notification system progress",
        2: "Polishing calendar interactions",
        3: "Implementing data export functions",
        4: "Creating dashboard widgets",
        5: "Testing date handling edge cases"
      },
      {
        1: "Preparing for Sprint 3 demo",
        2: "Finalizing calendar view features",
        3: "Polishing analytics visualization",
        4: "Creating presentation designs",
        5: "Final regression testing for sprint"
      },
      {
        1: "Sprint 3 review and retrospective",
        2: "Documenting advanced features",
        3: "Preparing for final sprint",
        4: "Collecting user feedback on new features",
        5: "Reporting on testing results"
      }
    ],
    4: [
      // Sprint 4 - Polish & Launch
      {
        1: "Planning final sprint and launch timeline",
        2: "Starting performance optimization work",
        3: "Implementing final API refinements",
        4: "Designing marketing materials",
        5: "Planning comprehensive testing"
      },
      {
        1: "Coordinating bug fix priorities",
        2: "Optimizing component rendering",
        3: "Refining data loading patterns",
        4: "Creating launch announcement designs",
        5: "Conducting security testing"
      },
      {
        1: "Reviewing performance improvements",
        2: "Implementing keyboard shortcuts",
        3: "Optimizing local storage usage",
        4: "Finalizing responsive designs",
        5: "Testing with screen readers for accessibility"
      },
      {
        1: "Addressing critical bug reports",
        2: "Building advanced filtering options",
        3: "Implementing data backup functionality",
        4: "Creating help documentation designs",
        5: "Performance testing on low-end devices"
      },
      {
        1: "Conducting pre-launch review meeting",
        2: "Polishing animations and transitions",
        3: "Implementing final data validations",
        4: "Designing user feedback collection UI",
        5: "Final cross-browser testing"
      },
      {
        1: "Meeting with stakeholders for launch approval",
        2: "Adding final UI polish and refinements",
        3: "Optimizing initial load performance",
        4: "Creating user guides and tooltips",
        5: "Conducting final regression testing"
      },
      {
        1: "Preparing deployment checklist",
        2: "Implementing dark mode support",
        3: "Building analytics event tracking",
        4: "Finalizing all design assets",
        5: "Verifying all test cases pass"
      },
      {
        1: "Conducting pre-launch team demo",
        2: "Final UI review and adjustments",
        3: "Preparing database for production",
        4: "Creating onboarding experience",
        5: "Final accessibility compliance testing"
      },
      {
        1: "Overseeing final preparations for launch",
        2: "Documentation for future maintenance",
        3: "Setting up monitoring and logging",
        4: "Creating post-launch survey design",
        5: "Final user acceptance testing"
      },
      {
        1: "Project launch and retrospective",
        2: "Monitoring post-launch metrics",
        3: "Support for any critical issues",
        4: "Gathering initial user feedback",
        5: "Documenting test results and quality metrics"
      }
    ]
  };

  // Generate an update based on the team member role, day, and sprint
  const sprintDay = day - (sprint?.startDay - 1);
  const dayIndex = (sprintDay - 1) % 10;
  const roleIndex = member.id;

  if (sprint && sprintProgress[sprint.id] && sprintProgress[sprint.id][dayIndex] && sprintProgress[sprint.id][dayIndex][roleIndex]) {
    const task = sprintProgress[sprint.id][dayIndex][roleIndex];
    
    return {
      member,
      yesterday: sprintDay > 1 ? 
        (sprintDay > 1 && sprintDay <= 10 ? 
          sprintProgress[sprint.id][dayIndex-1 < 0 ? 0 : dayIndex-1][roleIndex] : 
          "Completed tasks from previous day") : 
        "Planning and research",
      today: task,
      blockers: Math.random() > 0.8 ? 
        "Waiting for design assets" : 
        Math.random() > 0.9 ? 
          "Integration issue with new component" : 
          "None"
    };
  }

  // Fallback for any missing data
  return {
    member,
    yesterday: "Worked on assigned tasks",
    today: "Continuing development work",
    blockers: "None"
  };
};

// Generate a summary for each day
const generateDailySummary = (day, sprint) => {
  if (!sprint) return "Planning day - setting up project basics";
  
  const sprintProgress = {
    1: [
      "Team kickoff and initial planning",
      "Market research and competitive analysis",
      "User persona development and requirement gathering",
      "Technical stack evaluation and decisions",
      "Initial project setup and repository creation",
      "Design system research and UI component selection",
      "Basic wireframing and user flow diagramming",
      "Sprint planning and task breakdown",
      "Development environment setup and configuration",
      "Sprint 1 review and planning for core functionality"
    ],
    2: [
      "Starting core feature development",
      "Authentication system implementation",
      "Basic task management functionality",
      "User profile and settings development",
      "Task list views and filtering options",
      "Form validation and error handling",
      "Data persistence layer implementation",
      "Responsive design implementation",
      "Cross-browser testing and bug fixes",
      "Sprint 2 review and planning for advanced features"
    ],
    3: [
      "Calendar integration development kickoff",
      "Task visualization in calendar view",
      "Analytics dashboard framework",
      "Data aggregation for statistics",
      "Notification system implementation",
      "Performance optimizations for data handling",
      "Chart and graph component development",
      "Advanced filtering and sorting options",
      "User testing and feedback collection",
      "Sprint 3 review and planning for final polish"
    ],
    4: [
      "Final UI polish and refinements",
      "Performance optimization across the application",
      "Bug fixing and edge case handling",
      "Accessibility improvements",
      "Final responsive design adjustments",
      "Documentation and help content creation",
      "User onboarding experience implementation",
      "Final testing across devices and browsers",
      "Preparation for deployment",
      "Project launch and celebration"
    ]
  };
  
  const sprintDay = day - (sprint.startDay - 1);
  return sprintProgress[sprint.id][sprintDay - 1] || "Continuing development work";
};

const standupData = generateStandupData();

export default function ProjectHistory() {
  const [filteredDay, setFilteredDay] = useState<string>("all");
  const [filteredSprint, setFilteredSprint] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Filter the standup data
  const filteredData = standupData.filter(entry => {
    const matchesDay = filteredDay === "all" || entry.day.toString() === filteredDay;
    const matchesSprint = filteredSprint === "all" || entry.sprintId?.toString() === filteredSprint;
    const matchesSearch = searchTerm === "" || 
      entry.dailySummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.teamUpdates.some(update => 
        update.today.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.yesterday.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.blockers.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesDay && matchesSprint && matchesSearch;
  });
  
  // Get current sprint info
  const getCurrentSprintInfo = (sprintId: number) => {
    const sprint = sprints.find(s => s.id === sprintId);
    return sprint ? (
      <div className="mb-4 mt-2">
        <h3 className="text-md font-medium">Sprint Focus: {sprint.focus}</h3>
        <p className="text-sm text-muted-foreground">Goals: {sprint.goals}</p>
      </div>
    ) : null;
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Project History & Standups</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
            <CardDescription>
              40-day development timeline for TaskAI across 4 sprints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sprints.map(sprint => (
                <div key={sprint.id} className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="text-lg font-medium">
                    {sprint.name} (Days {sprint.startDay}-{sprint.endDay})
                  </h3>
                  <p className="text-muted-foreground">Focus: {sprint.focus}</p>
                  <p className="text-sm mt-1">{sprint.goals}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search standups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filteredSprint}
              onValueChange={setFilteredSprint}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by sprint" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sprints</SelectItem>
                {sprints.map(sprint => (
                  <SelectItem key={sprint.id} value={sprint.id.toString()}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filteredDay}
              onValueChange={setFilteredDay}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {standupData.map(entry => (
                  <SelectItem key={entry.day} value={entry.day.toString()}>
                    Day {entry.day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {filteredData.map(entry => (
            <Card key={entry.day} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Day {entry.day} - {entry.date}</CardTitle>
                    <CardDescription>
                      {entry.sprintName} - Day {entry.day - (sprints.find(s => s.id === entry.sprintId)?.startDay - 1)} of Sprint
                    </CardDescription>
                  </div>
                  <Badge variant={entry.sprintId === 1 ? "secondary" : 
                               entry.sprintId === 2 ? "default" : 
                               entry.sprintId === 3 ? "outline" : 
                               "destructive"}>
                    {entry.sprintName}
                  </Badge>
                </div>
                {entry.sprintId && getCurrentSprintInfo(entry.sprintId)}
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <h3 className="font-medium mb-1">Daily Summary:</h3>
                  <p className="text-sm">{entry.dailySummary}</p>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Team Member</TableHead>
                        <TableHead>Yesterday</TableHead>
                        <TableHead>Today</TableHead>
                        <TableHead className="w-[200px]">Blockers</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entry.teamUpdates.map((update, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            <div>
                              {update.member.name}
                              <div className="text-xs text-muted-foreground">{update.member.role}</div>
                            </div>
                          </TableCell>
                          <TableCell>{update.yesterday}</TableCell>
                          <TableCell>{update.today}</TableCell>
                          <TableCell>
                            {update.blockers === "None" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                None
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                {update.blockers}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
