import type { ResumeTemplateComponentProps } from '@/lib/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, User, Briefcase, GraduationCap, Lightbulb, Code2, Wrench } from 'lucide-react';

const TechnicalTemplate: React.FC<ResumeTemplateComponentProps> = ({ data }) => {
  const { personalDetails, education, experience, projects, skills } = data;

  const SectionTitle: React.FC<{ title: string, icon?: React.ElementType }> = ({ title, icon: Icon }) => (
    <div className="flex items-center mt-5 mb-2 border-b border-border pb-1">
      {Icon && <Icon className="w-4 h-4 mr-2 text-muted-foreground" />}
      <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Roboto Mono', monospace" }}>{title}</h2>
    </div>
  );

  const ContactLink: React.FC<{ href?: string, text?: string, icon?: React.ElementType, srLabel: string }> = ({ href, text, icon: Icon, srLabel }) => {
    if (!text) return null;
    const linkContent = href?.startsWith('mailto:') ? text : text.replace(/^https?:\/\/(www\.)?/, '');
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center">
        {Icon && <Icon className="w-3 h-3 mr-1 shrink-0" />}
        <span className="sr-only">{srLabel}</span>{linkContent}
      </a>
    );
  };


  return (
    <div className="p-6 bg-card text-card-foreground text-xs leading-normal shadow-md print:bg-white print:text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-primary">{personalDetails.fullName}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-1 text-muted-foreground">
          {personalDetails.email && <ContactLink href={`mailto:${personalDetails.email}`} text={personalDetails.email} icon={Mail} srLabel="Email" />}
          {personalDetails.phoneNumber && <span className="text-xs flex items-center"><Phone className="w-3 h-3 mr-1" />{personalDetails.phoneNumber}</span>}
          {personalDetails.address && <span className="text-xs flex items-center"><MapPin className="w-3 h-3 mr-1" />{personalDetails.address}</span>}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-1">
          {personalDetails.linkedin && <ContactLink href={personalDetails.linkedin} text={personalDetails.linkedin} icon={Linkedin} srLabel="LinkedIn" />}
          {personalDetails.github && <ContactLink href={personalDetails.github} text={personalDetails.github} icon={Github} srLabel="GitHub" />}
          {personalDetails.portfolio && <ContactLink href={personalDetails.portfolio} text={personalDetails.portfolio} icon={Globe} srLabel="Portfolio" />}
        </div>
      </header>

      {/* Summary */}
      {personalDetails.summary && (
        <section>
          <SectionTitle title="Summary" icon={User} />
          <p className="whitespace-pre-line text-card-foreground/90">{personalDetails.summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <SectionTitle title="Skills" icon={Wrench} />
          <div className="space-y-1">
            {Object.entries(
              skills.reduce((acc, skill) => {
                const category = skill.category || 'General';
                if (!acc[category]) {
                  acc[category] = [];
                }
                if (skill.name) { // Only push valid skill names
                  acc[category].push(skill.name);
                }
                return acc;
              }, {} as Record<string, string[]>)
            )
            .sort(([categoryA], [categoryB]) => {
              if (categoryA === "General" && categoryB !== "General") return 1;
              if (categoryA !== "General" && categoryB === "General") return -1;
              return categoryA.localeCompare(categoryB);
            })
            .map(([category, skillNames]) => {
              const filteredSkillNames = skillNames.filter(s => s); // Ensure only valid names are joined
              if (filteredSkillNames.length === 0) return null; // Don't render category if no skills

              return (
                <div key={category} className="flex items-baseline">
                  <strong className="w-1/4 font-medium text-muted-foreground shrink-0 pr-2 text-right text-xs" style={{ fontFamily: "'Roboto Mono', monospace" }}>{category}:</strong>
                  <span className="font-mono text-card-foreground/80">{filteredSkillNames.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <SectionTitle title="Experience" icon={Briefcase} />
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-semibold text-primary">{exp.jobTitle}</h3>
                <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="italic text-xs text-muted-foreground mb-0.5">{exp.company}</p>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-card-foreground/80">
                {exp.responsibilities.map((resp, idx) => resp && <li key={idx}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}
      
      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <SectionTitle title="Projects" icon={Lightbulb} />
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-semibold text-primary">{proj.name}</h3>
                {proj.link && <ContactLink href={proj.link} text="Link" icon={Globe} srLabel="Project Link" />}
              </div>
              <p className="mt-0.5 mb-0.5 text-card-foreground/90">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p className="text-xs">
                  <strong className="font-medium text-muted-foreground">Technologies:</strong>{' '}
                  <span className="font-mono text-card-foreground/80">{proj.technologies.filter(t => t).join(', ')}</span>
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <SectionTitle title="Education" icon={GraduationCap} />
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-semibold text-primary">{edu.degree}</h3>
                <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
              </div>
              <p className="italic text-xs text-muted-foreground">{edu.institution} - {edu.fieldOfStudy}</p>
              {edu.description && <p className="mt-0.5 text-card-foreground/80">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TechnicalTemplate;
