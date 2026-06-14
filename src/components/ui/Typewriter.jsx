import { useState, useEffect, useCallback } from 'react';

export default function Typewriter({
  phrases = [],
  typingSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  className,
}) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = phrases[phraseIndex % phrases.length] || '';

  const tick = useCallback(() => {
    if (!isDeleting) {
      setText(currentPhrase.slice(0, text.length + 1));
    } else {
      setText(currentPhrase.slice(0, text.length - 1));
    }
  }, [currentPhrase, text, isDeleting]);

  useEffect(() => {
    if (!phrases.length) return;

    let timeout;
    if (!isDeleting && text === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    } else {
      timeout = setTimeout(tick, isDeleting ? deleteSpeed : typingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentPhrase, phrases, tick, typingSpeed, deleteSpeed, pauseDuration]);

  // Reset when phrases change
  useEffect(() => {
    setText('');
    setPhraseIndex(0);
    setIsDeleting(false);
  }, [phrases]);

  if (!phrases.length) return null;

  return (
    <span className={className} aria-label={currentPhrase}>
      {text}
      <span className="inline-block w-[2px] h-[0.9em] bg-primary dark:bg-primary-dark ml-0.5 animate-pulse align-middle" />
    </span>
  );
}
