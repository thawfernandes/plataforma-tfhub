import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../services/mockDb';
import { ExternalLink, Calendar, CheckCircle2, Folder, User, MapPin } from 'lucide-react';
import { PortfolioCard, Modal } from '../../../components/index';
import { thumbnailService } from '../../../services/thumbnailService';
import TeamSection from '../../institutional/sections/TeamSection';

export default function PortfolioListView() {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    setProjects(mockDb.get('portfolio') || []);
    setTeam(mockDb.get('team') || []);
  }, []);

  // Sort projects by order ascending
  const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Nosso <span style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portfólio</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: 'var(--spacing-xs) auto 0', fontSize: '1.05rem' }}>
            Conheça os projetos, sistemas e soluções sob demanda desenvolvidos pela nossa equipe.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          {sortedProjects.map(project => (
            <PortfolioCard 
              key={project.id} 
              project={project} 
              onLearnMore={(p) => setActiveProject(p)}
            />
          ))}
        </div>
      </div>

      {/* Modal de Detalhes do Projeto */}
      <Modal
        open={!!activeProject}
        onClose={() => setActiveProject(null)}
        title={activeProject?.name || ''}
        size="lg"
      >
        {activeProject && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {/* Imagem de Capa ou Galeria */}
            <div style={{ 
              width: '100%', 
              height: '320px', 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden', 
              position: 'relative',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)'
            }}>
              {thumbnailService.getProjectImage(activeProject) ? (
                <img 
                  src={thumbnailService.getProjectImage(activeProject)} 
                  alt={activeProject.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => {
                    if (activeProject?.link && e.target.src !== thumbnailService.getFallbackScreenshot(activeProject.link)) {
                      e.target.src = thumbnailService.getFallbackScreenshot(activeProject.link);
                    }
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, opacity: 0.3 }}>{activeProject.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()}</span>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 500 }}>Print real do projeto em breve</p>
                </div>
              )}
            </div>

            {/* Grid de Ficha Técnica */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: 'var(--spacing-sm)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} style={{ color: 'var(--accent)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ano</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeProject.year || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeProject.status || 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Folder size={18} style={{ color: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tipo de Projeto</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeProject.projectType || activeProject.category}</div>
                </div>
              </div>
              {activeProject.client && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} style={{ color: 'var(--silver)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cliente</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeProject.client}</div>
                  </div>
                </div>
              )}
              {(activeProject.address || activeProject.location) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} style={{ color: 'var(--accent)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Endereço</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeProject.address || activeProject.location}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Descrição e Detalhes */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--spacing-xs)' }}>Sobre o Projeto</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{activeProject.description}</p>
            </div>

            {/* Tecnologias */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--spacing-xs)' }}>Tecnologias Utilizadas</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeProject.technologies?.map((tech, idx) => (
                  <span 
                    key={idx} 
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Galeria de Telas Adicionais */}
            {activeProject.images && activeProject.images.length > 1 && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--spacing-xs)' }}>Galeria do Projeto</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                  {activeProject.images.slice(1).map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        borderRadius: 'var(--radius-sm)', 
                        overflow: 'hidden', 
                        height: '80px',
                        border: '1px solid var(--border-color)' 
                      }}
                    >
                      <img src={imgUrl} alt={`Tela ${idx + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link do Projeto */}
            {activeProject.link && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-sm)' }}>
                <a 
                  href={activeProject.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ gap: '6px' }}
                >
                  <span>Visitar Projeto</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 'var(--spacing-xl)' }}>
        <TeamSection team={team} />
      </div>
    </>
  );
}
