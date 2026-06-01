import React from 'react';
import { SUBJECTS } from '../data/subjects';

export const SubjectLegend: React.FC = () => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '1rem',
      overflowY: 'auto',
      maxHeight: '400px',
      padding: '0.5rem',
      marginTop: '1rem'
    }}>
      {SUBJECTS.map((subject) => (
        <div key={subject.id} style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          borderRadius: '6px',
          padding: '1rem',
          transition: 'all 0.3s ease',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary-cyan)';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.2)';
          e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: subject.color }}>{subject.name}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {subject.objects.map((obj) => (
              <div key={obj.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.05)', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}>
                <span style={{ marginRight: '4px', fontSize: '1rem' }}>{obj.emoji}</span>
                <span>{obj.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};