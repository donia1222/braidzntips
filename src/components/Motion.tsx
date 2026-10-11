'use client';

import { useEffect } from 'react';

let started = false;

export default function Motion() {
  useEffect(() => {
    if (started) return;
    started = true;
    import('../scripts/motion').then(({ initMotion }) => initMotion());
  }, []);
  return null;
}
