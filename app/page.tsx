'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const BACKGROUND_VIDEO_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/Background.mp4';
const PROFILE_PICTURE_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/portrait.jpg';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@HukeIsMe/videos';
const S3_BASE_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/';

const categories = [
  { name: 'About Me', content: 'profile' },
  { name: 'Contact Me', content: 'For collaborations' },
  { name: 'YouTube', content: 'Scripted and edited projects', url: YOUTUBE_CHANNEL_URL },
  { name: 'Graphics', content: 'Visual designs and branding' },
  { name: 'Sports Graphics', content: 'Visuals for sports events' },
  { name: 'Animation', content: 'Bringing ideas to life' },
  { name: 'Short Form', content: 'Engaging bite-sized videos' },
  { name: 'Onboarding', content: 'User-friendly guides' },
  { name: 'Thumbnails', content: 'Custom thumbnail designs' }
];

export default function Home() {
  const [modalContent, setModalContent] = useState<{ title: string, files: string[] }>({ title: '', files: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedImage, setFocusedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

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
    const maxFiles = 20; // Increase this number if you have more files in some categories

    for (let i = 1; i <= maxFiles; i++) {
      const fileExtensions = ['png', 'jpg', 'mp4', 'webm'];
      let fileFound = false;

      for (const ext of fileExtensions) {
        const fileName = `${folderName} (${i}).${ext}`;
        const fileUrl = `${S3_BASE_URL}${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;

        try {
          const response = await fetch(fileUrl, { method: 'HEAD' });
          if (response.ok) {
            files.push(fileUrl);
            fileFound = true;
            break;
          }
        } catch (error) {
          console.error(`Error checking file ${fileName}:`, error);
        }
      }

      if (!fileFound) {
        break; // Stop searching if no file is found for this index
      }
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
