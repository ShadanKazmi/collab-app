import React, { useEffect, useRef } from 'react';
import TeamDetails from '../Components/TeamDetails';
import TeamFeed from '../Components/TeamFeed';

const TeamPage = () => {
  const bottomRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      console.log("scroll");
    };

    setTimeout(scrollToBottom, 100);
  }, []);

  return (
    <div className="relative">
      <TeamDetails />
      <div className="mt-4">
        <TeamFeed />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default TeamPage;
