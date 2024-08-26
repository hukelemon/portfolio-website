'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const BACKGROUND_VIDEO_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/Background.mp4';
const PROFILE_PICTURE_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/portrait.jpg';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@HukeIsMe/videos';

const categories = [
  { name: 'About Me', content: 'profile' },
  { name: 'Contact Me', content: 'For collaborations' },
  { name: 'YouTube', content: 'Scripted and edited projects', url: YOUTUBE_CHANNEL_URL },
  { name: 'Graphics', content: 'Visual designs and branding' },
  { name: 'Sports Graphics', content: 'Visuals for sports events' },
  { name: 'Animation', content: 'Bringing ideas to life' },
  { name: 'Short Form', content: 'Engaging bite-sized videos' },
  { name: 'Onboarding', content: 'User-friendly guides' },
  { name: 'Icons', content: 'Custom icon designs' }
];

export default function Home() {
  const [modalContent, setModalContent] = useState<{ title: string, files: string[] }>({ title: '', files: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedImage, setFocusedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

   useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        console.log("Video can play");
        setVideoStatus('Can play');
        video.play().then(() => {
          console.log("Video playing");
          setVideoStatus('Playing');
        }).catch(error => {
          console.error("Error playing video:", error);
          setVideoError(`Play error: ${error.message}`);
          setVideoStatus('Play error');
        });
      };

      const handleError = (e: Event) => {
        const error = (e.target as HTMLVideoElement).error;
        console.error("Video error:", error);
        setVideoError(`Video error: ${error?.message}`);
        setVideoStatus('Error');
      };

      const handleLoadedMetadata = () => {
        console.log("Video metadata loaded");
        setVideoStatus('Metadata loaded');
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      // Force the video to load
      video.load();
      setVideoStatus('Loading');

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  const openModal = async (category: string) => {
    if (category !== 'About Me' && category !== 'Contact Me' && category !== 'YouTube') {
      try {
        const files = await fetchFilesFromS3(category);
        setModalContent({ title: category, files });
        setIsModalOpen(true);
      } catch (error) {
        console.error('Error loading files:', error);
      }
    }
  };

  const fetchFilesFromS3 = async (category: string): Promise<string[]> => {
    const folderName = category === 'Animation' ? 'Animation  ' : category;
    const files: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const fileExtension = ['mp4', 'webm'].includes(category.toLowerCase()) ? 'mp4' : 'png';
      const fileName = `${folderName} (${i}).${fileExtension}`;
      const fileUrl = `${BACKGROUND_VIDEO_URL}/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
      files.push(fileUrl);
    }
    return files;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFocusedImage(null);
  };

  const focusImage = (file: string) => {
    setFocusedImage(file);
  };

  const closeFocusedImage = () => {
    setFocusedImage(null);
  };

  const renderFile = (file: string) => {
    const extension = file.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')) {
      return (
        <Image
          src={file}
          alt={file.split('/').pop() || ''}
          width={300}
          height={200}
          objectFit="cover"
          onClick={() => focusImage(file)}
          className="modal-image"
        />
      );
    } else if (['mp4', 'webm'].includes(extension || '')) {
      return (
        <video width="300" height="200" controls className="modal-video">
          <source src={file} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      );
    }
    return null;
  };

  return (
    <div className="container">
      {videoError && (
        <div style={{ position: 'fixed', top: 0, left: 0, background: 'red', color: 'white', padding: '10px', zIndex: 9999 }}>
          {videoError}
        </div>
      )}
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline 
        className="background-video"
      >
        <source src={BACKGROUND_VIDEO_URL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <main className="main">
        <div className="grid">
          {categories.map((category) => (
            <div key={category.name} className="card">
              <div className="card-content">
                {category.name === 'About Me' ? (
                  <div className="about-me-content">
                    <Image
                      src={PROFILE_PICTURE_URL}
                      alt="Scott's profile"
                      width={50}
                      height={50}
                      className="profile-pic"
                    />
                    <h2>Scott</h2>
                    <p>27 years old<br />Content Creator</p>
                  </div>
                ) : category.name === 'Contact Me' ? (
                  <>
                    <h2>{category.name}</h2>
                    <p>{category.content}</p>
                    <div className="contact-icons">
                      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=scott@dobyns.co" target="_blank" rel="noopener noreferrer">Email</a>
                      <a href="https://discord.com/users/120582455043424257" target="_blank" rel="noopener noreferrer">Discord</a>
                      <a href="https://x.com/Scott_GFX" target="_blank" rel="noopener noreferrer">Twitter</a>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>{category.name}</h2>
                    <p>{category.content}</p>
                    {category.name === 'YouTube' ? (
                      <a 
                        href={category.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="see-more"
                      >
                        See More
                      </a>
                    ) : (
                      <button className="see-more" onClick={() => openModal(category.name)}>
                        See More
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{modalContent.title}</h2>
            <div className="modal-gallery">
              {modalContent.files.map((file, index) => (
                <div key={index} className="modal-item">
                  {renderFile(file)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {focusedImage && (
        <div className="focused-image-overlay" onClick={closeFocusedImage}>
          <div className="focused-image-container">
            <Image
              src={focusedImage}
              alt="Focused image"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
