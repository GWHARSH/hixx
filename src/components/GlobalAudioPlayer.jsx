import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function GlobalAudioPlayer() {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audioSource, setAudioSource] = useState('/bg-music.mp3');
  const audioRef = useRef(null);

  // Update audio source when settings change
  useEffect(() => {
    const dbUrl = settings?.bg_music_url;
    if (dbUrl && dbUrl.startsWith('http') && !dbUrl.includes('idb://') && !dbUrl.includes('firestore_media://')) {
      setAudioSource(dbUrl);
    } else {
      setAudioSource('/bg-music.mp3');
    }
  }, [settings?.bg_music_url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle source errors by falling back to default /bg-music.mp3
  const handleAudioError = () => {
    console.warn('[AudioPlayer] Audio playback warning or source change');
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('[AudioPlayer] Playback blocked or failed:', err);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="music-toggle" style={{ zIndex: 9999 }}>
      <audio
        key={audioSource}
        ref={audioRef}
        loop
        preload="auto"
        onError={handleAudioError}
      >
        {audioSource && audioSource !== '/bg-music.mp3' ? (
          <source src={audioSource} type="audio/mpeg" />
        ) : null}
        <source src="/bg-music.mp3" type="audio/mpeg" />
        <source src="/bg-music.mp3.mp3" type="audio/mpeg" />
      </audio>
      <div className="music-toggle__controls">
        <button
          className={`music-toggle__btn ${isPlaying ? 'music-toggle__btn--playing' : ''}`}
          onClick={toggleMusic}
          aria-label="Toggle Music"
          title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
        >
          {isPlaying ? <Volume2 size={18} color="#00F0FF" /> : <VolumeX size={18} />}
        </button>
        <div className="music-toggle__slider-wrap">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            className="music-toggle__slider"
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (audioRef.current) audioRef.current.volume = val;
            }}
          />
        </div>
      </div>
    </div>
  );
}
