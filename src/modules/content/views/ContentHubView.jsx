import React, { useState, useEffect } from 'react';
import { mockDb } from '../../../services/mockDb';
import { youtubeService } from '../../../services/youtubeService';
import { FileText, Play, Eye } from 'lucide-react';

export default function ContentHubView() {
  const [contents, setContents] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const loadContent = async () => {
    const articles = mockDb.get('content') || [];
    const ytVideos = await youtubeService.getLatestVideos();
    // Merge manual content items with YouTube channel synced items
    setContents([...articles, ...ytVideos]);
  };

  useEffect(() => {
    loadContent();

    const handleSync = () => {
      loadContent();
    };
    window.addEventListener('tf_youtube_synced', handleSync);
    return () => window.removeEventListener('tf_youtube_synced', handleSync);
  }, []);

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Centro de Conteúdo</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Aprenda com nossos tutoriais, notícias, guias e vídeos explicativos.</p>
      </div>

      {selectedVideo && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
          padding: 'var(--spacing-lg)'
        }} onClick={() => setSelectedVideo(null)}>
          <div style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
              <h3>{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)} style={{ fontWeight: 'bold' }}>Fechar</button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe 
                src={selectedVideo.metadata.videoUrl} 
                title={selectedVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--spacing-lg)'
      }}>
        {contents.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <img 
              src={item.images[0]} 
              alt={item.title} 
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
            />
            <div style={{ padding: 'var(--spacing-sm) 0', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
                {item.type === 'video' ? 'Vídeo' : 'Artigo'}
              </span>
              <h3 style={{ margin: 'var(--spacing-xs) 0' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flexGrow: 1 }}>{item.body}</p>
              
              <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.type === 'video' ? (
                  <button className="btn btn-primary btn-sm" onClick={() => setSelectedVideo(item)}>
                    <Play size={16} />
                    <span>Assistir Vídeo</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Tempo de leitura: {item.metadata.readingTime || '5 min'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
