
import type { ResumeTemplateComponentProps } from '@/lib/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, User, Briefcase, GraduationCap, Lightbulb, Wrench } from 'lucide-react';

const CompactTemplate: React.FC<ResumeTemplateComponentProps> = ({ data }) => {
  const { personalDetails, education, experience, projects, skills } = data;

  const SectionTitle: React.FC<{ title: string; icon?: React.ElementType, className?: string }> = ({ title, icon: Icon, className }) => (
    <div className={`flex items-center mb-1.5 mt-2.5 ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-primary/80" />}
      <h2 className="text-xs font-bold text-primary uppercase tracking-wide">{title}</h2>
    </div>
  );

  const ContactItem: React.FC<{ icon: React.ElementType, text?: string, href?: string, label?: string }> = ({ icon: Icon, text, href }) => {
    if (!text) return null;
    const content = (
      <>
        <Icon className="w-3 h-3 mr-1 text-primary/70 shrink-0" />
        <span className="truncate">{text}</span>
      </>
    );
    return href ? (
      <a href={href.startsWith('http') || href.startsWith('mailto:') ? href : `https://${href}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-xxs text-foreground/75 hover:text-accent transition-colors">
        {content}
      </a>
    ) : (
      <span className="flex items-center text-xxs text-foreground/75">{content}</span>
    );
  };
  // Custom text-xxs Tailwind utility
  // Ensure this utility (e.g., text-xxs for 0.65rem or 10px) is defined in globals.css or tailwind.config.js if not standard
  // For simplicity here, assuming text-xs is small enough, or use style={{ fontSize: '0.65rem' }} directly.
  // We'll stick to text-xs for ShadCN compatibility and override with style if critical.

  return (
    <div className="p-4 bg-card text-card-foreground font-sans text-[10px] leading-snug shadow-sm print:bg-white print:text-gray-800" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Header */}
      <header className="text-center mb-3">
        <h1 className="text-xl font-bold text-primary">{personalDetails.fullName}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-0.5 mt-1 text-[9px] text-muted-foreground">
          {personalDetails.email && <ContactItem icon={Mail} text={personalDetails.email} href={`mailto:${personalDetails.email}`} />}
          {personalDetails.phoneNumber && <ContactItem icon={Phone} text={personalDetails.phoneNumber} />}
          {personalDetails.address && <ContactItem icon={MapPin} text={personalDetails.address} />}
          {personalDetails.linkedin && <ContactItem icon={Linkedin} text="LinkedIn" href={personalDetails.linkedin} />}
          {personalDetails.github && <ContactItem icon={Github} text="GitHub" href={personalDetails.github} />}
          {personalDetails.portfolio && <ContactItem icon={Globe} text="Portfolio" href={personalDetails.portfolio} />}
        </div>
      </header>

      {/* Summary */}
      {personalDetails.summary && (
        <section className="mb-2">
          <SectionTitle title="Summary" icon={User} />
          <p className="text-foreground/85 whitespace-pre-line text-[9px]">{personalDetails.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-12 gap-x-3">
        <div className="col-span-7 space-y-1.5">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <SectionTitle title="Experience" icon={Briefcase} />
              {experience.map((exp) => (
                <div key={exp.id} className="mb-1.5">
                  <h3 className="text-[11px] font-semibold text-primary">{exp.jobTitle}</h3>
                  <div className="flex justify-between items-baseline text-[9px] text-muted-foreground">
                    <p className="font-medium">{exp.company}</p>
                    <p>{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <ul className="list-disc list-outside ml-2.5 mt-0.5 space-y-0 text-foreground/80 text-[9px]">
                    {exp.responsibilities.map((resp, idx) => resp && <li key={idx} className="leading-tight">{resp}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="col-span-5 space-y-1.5">
           {/* Education */}
           {education.length > 0 && (
            <section>
              <SectionTitle title="Education" icon={GraduationCap} />
              {education.map((edu) => (
                <div key={edu.id} className="mb-1.5">
                  <h3 className="text-[11px] font-semibold text-primary">{edu.degree}</h3>
                  <p className="text-[9px] italic text-foreground/75">{edu.institution}</p>
                  {edu.fieldOfStudy && <p className="text-[9px] text-muted-foreground">{edu.fieldOfStudy}</p>}
                  <p className="text-[9px] text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                  {edu.description && <p className="mt-0.5 text-foreground/80 text-[9px] leading-tight">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <SectionTitle title="Skills" icon={Wrench} />
              <div className="flex flex-wrap gap-1 text-[9px]">
                {skills.map((skill) => skill.name && (
                  <span key={skill.id} className="bg-muted/70 text-muted-foreground/90 px-1.5 py-0.5 rounded-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>


      {/* Projects - Full Width if present */}
      {projects.length > 0 && (
        <section className="mt-2 col-span-12">
          <SectionTitle title="Projects" icon={Lightbulb} />
          {projects.map((proj) => (
            <div key={proj.id} className="mb-1.5">
               <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold text-primary">{proj.name}</h3>
                {proj.link && (
                  <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-[9px] text-accent hover:underline flex items-center">
                    <Globe className="w-2.5 h-2.5 mr-0.5" /> Link
                  </a>
                )}
              </div>
              <p className="text-[9px] mt-0.5 text-foreground/80 leading-tight">{proj.description}</p>
              {proj.technologies.length > 0 && <p className="text-[9px] mt-0.5"><strong className="text-foreground/85">Built with:</strong> {proj.technologies.filter(t => t).join(', ')}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default CompactTemplate;
