import { ArrowRight, ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Eazy Bank Microservice",
    description: "Cloud-native banking app with independent services for accounts, cards, and loans, deployed using Docker.",
    // description: "A beautiful landing page app using React and Tailwind.",
    image: "/projects/project1.png",
    tags: ["Spring Boot", "Microservices", "Keycloak", "Docker" , "Kubernetes"],
    demoUrl: "#",
    githubUrl: "https://github.com/satyamkumarmishra2005/eazy-bank-Microservice",
  },
  {
    id: 2,
    title: "Fitness App ",
    description:
      "AI-powered fitness platform with scalable microservices, API Gateway, and secure authentication via Keycloak.",
    image: "/projects/project2.png",
    tags: ["Spring Boot", "React", "Keycloak","PostgreSQL","MongoDB"],
    demoUrl: "#",
    githubUrl: "https://github.com/satyamkumarmishra2005/fitness-app-microservices",
  },
  {
    id: 3,
    title: "Secure Notes",
    description:
      " Encrypted note-taking application ensuring privacy with secure authentication and data storage.",
    image: "/projects/project3.png",
    tags: ["Spring Boot", "React", "OAuth2", "Docker" , "MySQL"],
    // demoUrl: "#",
    githubUrl: "https://github.com/satyamkumarmishra2005/Secure-Notes",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          Featured <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, key) => (
            <div
              key={key}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1"> {project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      {/* <ExternalLink size={20} /> */}
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/satyamkumarmishra2005"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
