'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const BACKGROUND_VIDEO_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/Background.mp4';
const PROFILE_PICTURE_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/portrait.jpg';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@HukeIsMe/videos';
const S3_BASE_URL = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/';

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
      console.log(`Opening modal for category: ${category}`);
      try {
        const files = await fetchFilesFromS3(category);
        if (files.length === 0) {
          console.error(`No files found for ${category}`);
          alert(`No files found for ${category}. Please check the console for more details.`);
        } else {
          console.log(`Found ${files.length} files for ${category}`);
          setModalContent({ title: category, files });
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error(`Error loading files for ${category}:`, error);
        alert(`Error loading files for ${category}. Please check the console for more details.`);
      }
    }
  };

  const testS3Access = async () => {
    const testFileUrl = 'https://scottsportfolio1996.s3.us-east-2.amazonaws.com/New+folder/Animation/Animation+(1).mp4';
    console.log(`Testing S3 access with file: ${testFileUrl}`);
  
    try {
      const response = await fetch(testFileUrl, { method: 'HEAD' });
      console.log(`Test file response status: ${response.status}`);
      if (response.ok) {
        console.log('S3 test file is accessible');
        alert('S3 test file is accessible');
      } else {
        console.error(`S3 test file is not accessible. Status: ${response.status}`);
        alert(`S3 test file is not accessible. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error accessing S3 test file:', error);
      alert('Error accessing S3 test file. Check console for details.');
    }
  };
  
  // Add this button to your JSX
  <button onClick={testS3Access}>Test S3 Access</button>


  const fetchFilesFromS3 = async (category: string): Promise<string[]> => {
    console.log(`Fetching files for category: ${category}`);
    const files: string[] = [];
    const maxFiles = 20;
  
    // Handle special cases for folder names
    const folderMappings: { [key: string]: string } = {
      "Short Form": "Short+Form",
      "Onboarding": "onboarding",
      "Animation": "Animation",
      "Thumbnails": "Thumbnails"
    };
    const folderName = folderMappings[category] || category;
  
    // Handle special cases for file names
    const fileNameMappings: { [key: string]: string } = {
      "Short Form": "Short form",
      "Animation": "animation ",
      "Thumbnails": "thumbnails"
    };
    const baseFileName = fileNameMappings[category] || category;
  
    const startIndex = category === "Onboarding" ? 0 : 1;
  
    for (let i = startIndex; i <= maxFiles; i++) {
      const fileExtensions = ['png', 'jpg', 'mp4', 'webm'];
      let fileFound = false;
  
      for (const ext of fileExtensions) {
        const fileName = `${baseFileName} (${i}).${ext}`;
        // Don't encode the space and parentheses in the file name
        const encodedFileName = fileName.replace(/ /g, '+').replace(/\(/g, '%28').replace(/\)/g, '%29');
        const fileUrl = `${S3_BASE_URL}New+folder/${folderName}/${encodedFileName}`;
        console.log(`Checking file: ${fileUrl}`);
  
        try {
          const response = await fetch(fileUrl, { method: 'HEAD' });
          console.log(`Response status for ${fileUrl}: ${response.status}`);
          if (response.ok) {
            files.push(fileUrl);
            fileFound = true;
            console.log(`File found and added: ${fileUrl}`);
            break;
          } else {
            console.log(`File not found: ${fileUrl}`);
          }
        } catch (error) {
          console.error(`Error checking file ${fileName}:`, error);
        }
      }
  
      if (!fileFound && i > startIndex) {
        console.log(`No more files found after ${i - 1} files`);
        break;
      }
    }
  
    console.log(`Total files found for ${category}:`, files.length);
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
