import React from 'react';
import phoenixImg from '../../assets/phoenix.png';

/**
 * PhoenixLogo — Logo fênix da TF Hub
 * Design de fênix geométrica de cristal de polígono baixo em alta resolução.
 *
 * @param {number} size      — altura/largura em px
 * @param {string} className — classes CSS adicionais
 */
export default function PhoenixLogo({ size = 36, className = '' }) {
  return (
    <img
      src={phoenixImg}
      alt="TF Hub — Fênix"
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: '25%', // Sleek rounded square look for geometric logos
        objectFit: 'cover',
        display: 'block',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backgroundColor: '#000000',
      }}
    />
  );
}
