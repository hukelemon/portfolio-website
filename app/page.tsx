'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const S3_BUCKET_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder';
const BACKGROUND_VIDEO_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/Background.mp4';
const PROFILE_PICTURE_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/portrait.jpg';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@HukeIsMe/videos';

const categories = [
  { name: 'About Me', content: 'profile' },
  { name: 'Contact Me', content: 'For collaborations' },
  { name: 'Graphics', content: 'Visual designs and branding' },
  { name: 'Sports Graphics', content: 'Visuals for sports events' },
  { name: 'Animation', content: 'Bringing ideas to life' },
  { name: 'Short Form', content: 'Engaging bite-sized videos' },
  { name: 'Onboarding', content: 'User-friendly guides' },
  { name: 'Icons', content: 'Custom icon designs' },
  { name: 'YouTube', content: 'Scripted and edited projects', url: YOUTUBE_CHANNEL_URL }
];

export default function Home() {
  const [modalContent, setModalContent] = useState<{ title: string, files: string[] }>({ title: '', files: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedImage, setFocusedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error("Error playing video:", error));
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
    // ... (fetchFilesFromS3 function remains the same)
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
    // ... (renderFile function remains the same)
  };

  return (
    <div className="container">
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
