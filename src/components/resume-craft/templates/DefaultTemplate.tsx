import type { ResumeTemplateComponentProps } from '@/lib/resumeTypes';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';

const DefaultTemplate: React.FC<ResumeTemplateComponentProps> = ({ data }) => {
  const { personalDetails, education, experience, projects, skills } = data;

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-xl font-bold text-primary border-b-2 border-primary pb-1 mb-3">{title.toUpperCase()}</h2>
  );

  const ContactIcon: React.FC<{ icon: React.ElementType, text?: string, href?: string }> = ({ icon: Icon, text, href }) => {
    if (!text) return null;
    const content = <><Icon className="w-3.5 h-3.5 mr-1.5 text-primary" />{text}</>;
    return href ? <a href={href.startsWith('http') || href.startsWith('mailto:') ? href : `https://${href}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs hover:text-accent transition-colors">{content}</a> : <span className="flex items-center text-xs">{content}</span>;
  };

  return (
    <div className="p-6 bg-white text-gray-800 font-serif text-sm leading-relaxed shadow-lg" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">{personalDetails.fullName}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
          <ContactIcon icon={Mail} text={personalDetails.email} href={`mailto:${personalDetails.email}`} />
          <ContactIcon icon={Phone} text={personalDetails.phoneNumber} />
          <ContactIcon icon={MapPin} text={personalDetails.address} />
          <ContactIcon icon={Linkedin} text={personalDetails.linkedin} href={personalDetails.linkedin} />
          <ContactIcon icon={Github} text={personalDetails.github} href={personalDetails.github} />
          <ContactIcon icon={Globe} text={personalDetails.portfolio} href={personalDetails.portfolio} />
        </div>
      </header>

      {/* Summary */}
      {personalDetails.summary && (
        <section className="mb-4">
          <SectionTitle title="Summary" />
          <p className="text-xs">{personalDetails.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Experience" />
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <h3 className="text-md font-semibold">{exp.jobTitle}</h3>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <p className="font-medium">{exp.company}</p>
                <p>{exp.startDate} - {exp.endDate}</p>
              </div>
              <ul className="list-disc list-inside ml-4 mt-1 text-xs space-y-0.5">
                {exp.responsibilities.map((resp, idx) => resp && <li key={idx}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Education" />
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="text-md font-semibold">{edu.degree}</h3>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <p className="font-medium">{edu.institution} - {edu.fieldOfStudy}</p>
                <p>{edu.startDate} - {edu.endDate}</p>
              </div>
              {edu.description && <p className="text-xs mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Projects" />
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="text-md font-semibold">{proj.name}</h3>
              {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">{proj.link}</a>}
              <p className="text-xs mt-1">{proj.description}</p>
              {proj.technologies.length > 0 && <p className="text-xs mt-1"><strong>Technologies:</strong> {proj.technologies.filter(t => t).join(', ')}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <SectionTitle title="Skills" />
          <div className="flex flex-wrap gap-2 text-xs">
            {skills.map((skill) => skill.name && (
              <span key={skill.id} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                {skill.category ? `${skill.category}: ${skill.name}` : skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DefaultTemplate;
