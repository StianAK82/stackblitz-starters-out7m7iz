'use client';

import { useState } from 'react';
import AddTaskModal from './AddTaskModal';

export default function AddTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn-primary"
      >
        Legg til oppgave
      </button>
      <AddTaskModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}