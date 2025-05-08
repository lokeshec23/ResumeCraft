
import type { ResumeTemplateComponentProps } from '@/lib/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, User, Briefcase, GraduationCap, Lightbulb, Wrench, Sparkles } from 'lucide-react';

const LeftAlignedModernTemplate: React.FC<ResumeTemplateComponentProps> = ({ data }) => {
  const { personalDetails, education, experience, projects, skills } = data;

  const SidebarSection: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <section className="mb-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-2 flex items-center">
        <Icon className="w-4 h-4 mr-2" />
        {title}
      </h3>
      {children}
    </section>
  );

  const MainSectionTitle: React.FC<{ title: string; icon: React.ElementType }> = ({ title, icon: Icon }) => (
    <div className="flex items-center mb-3">
      <Icon className="w-5 h-5 mr-2.5 text-primary" />
      <h2 className="text-lg font-bold text-primary tracking-tight">{title}</h2>
    </div>
  );
  
  const ContactItem: React.FC<{ icon: React.ElementType, text?: string, href?: string, label?: string }> = ({ icon: Icon, text, href, label }) => {
    if (!text) return null;
    const content = (
      <div className="flex items-start">
        <Icon className="w-3.5 h-3.5 mr-2 mt-0.5 text-accent shrink-0" />
        <div>
          {label && <span className="block font-semibold text-xs text-sidebar-foreground/80">{label}</span>}
          <span className="block text-xs text-sidebar-foreground break-all">{text}</span>
        </div>
      </div>
    );
    return href ? (
      <a href={href.startsWith('http') || href.startsWith('mailto:') ? href : `https://${href}`} target="_blank" rel="noopener noreferrer" className="text-sidebar-foreground hover:text-accent transition-colors mb-1.5 last:mb-0">
        {content}
      </a>
    ) : (
      <div className="text-sidebar-foreground mb-1.5 last:mb-0">{content}</div>
    );
  };

  return (
    <div className="flex min-h-[297mm] bg-card text-card-foreground shadow-lg print:shadow-none print:bg-white print:text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-1/3 bg-sidebar text-sidebar-foreground p-6 print:bg-gray-100">
        <div className="text-center mb-6">
          {/* Placeholder for an avatar if desired */}
          {/* <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
            <User className="w-12 h-12 text-primary" />
          </div> */}
          <h1 className="text-2xl font-bold text-primary mb-1">{personalDetails.fullName}</h1>
          {/* <p className="text-sm text-muted-foreground">Optional Title Here</p> */}
        </div>

        <SidebarSection title="Contact" icon={User}>
          <ContactItem icon={Mail} text={personalDetails.email} href={`mailto:${personalDetails.email}`} />
          <ContactItem icon={Phone} text={personalDetails.phoneNumber} />
          <ContactItem icon={MapPin} text={personalDetails.address} />
          <ContactItem icon={Linkedin} text="LinkedIn" href={personalDetails.linkedin} />
          <ContactItem icon={Github} text="GitHub" href={personalDetails.github} />
          <ContactItem icon={Globe} text="Portfolio" href={personalDetails.portfolio} />
        </SidebarSection>

        {education.length > 0 && (
          <SidebarSection title="Education" icon={GraduationCap}>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 text-xs">
                <h4 className="font-semibold text-sidebar-primary-foreground">{edu.degree}</h4>
                <p className="italic text-sidebar-foreground/90">{edu.institution}</p>
                {edu.fieldOfStudy && <p className="text-sidebar-foreground/80">{edu.fieldOfStudy}</p>}
                <p className="text-sidebar-foreground/70 text-[11px]">{edu.startDate} - {edu.endDate}</p>
                {edu.description && <p className="mt-0.5 text-sidebar-foreground/80 text-[11px] leading-tight">{edu.description}</p>}
              </div>
            ))}
          </SidebarSection>
        )}

        {skills.length > 0 && (
          <SidebarSection title="Skills" icon={Wrench}>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {skills.map((skill) => skill.name && (
                <span key={skill.id} className="bg-sidebar-accent text-sidebar-accent-foreground px-2 py-1 rounded-md text-[11px]">
                  {skill.name}
                </span>
              ))}
            </div>
          </SidebarSection>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-6 space-y-5 text-sm">
        {personalDetails.summary && (
          <section>
            <MainSectionTitle title="Summary" icon={Sparkles} />
            <p className="text-xs text-foreground/85 whitespace-pre-line">{personalDetails.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <MainSectionTitle title="Experience" icon={Briefcase}/>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h3 className="text-md font-semibold text-primary">{exp.jobTitle}</h3>
                <div className="flex justify-between items-baseline text-xs text-muted-foreground mb-0.5">
                  <p className="font-medium italic">{exp.company}</p>
                  <p>{exp.startDate} - {exp.endDate}</p>
                </div>
                <ul className="list-disc list-outside ml-4 mt-1 text-xs space-y-0.5 text-foreground/80">
                  {exp.responsibilities.map((resp, idx) => resp && <li key={idx}>{resp}</li>)}
                </ul>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <MainSectionTitle title="Projects" icon={Lightbulb} />
            {projects.map((proj) => (
              <div key={proj.id} className="mb-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-primary">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center">
                        <Globe className="w-3 h-3 mr-1" /> View
                      </a>
                    )}
                  </div>
                <p className="text-xs mt-0.5 text-foreground/80">{proj.description}</p>
                {proj.technologies.length > 0 && <p className="text-xs mt-1"><strong className="text-foreground/90">Built with:</strong> {proj.technologies.filter(t => t).join(', ')}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default LeftAlignedModernTemplate;
