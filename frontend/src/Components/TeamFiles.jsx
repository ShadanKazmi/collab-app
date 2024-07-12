// import React, { useState, useEffect } from 'react';
// import { List, Icon, Segment } from 'semantic-ui-react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import useDownloader from 'react-use-downloader';

// const TeamFiles = () => {
//   const [teamFiles, setTeamFiles] = useState([]);
//   const location = useLocation();
//   const teamId = location.state.teamId;
//   const { download } = useDownloader();

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await axios.get(`https://collab-app-backend.onrender.com/files/${teamId}`);
//         setTeamFiles(response.data.uploadedContents); // Assuming response structure matches provided example
//       } catch (error) {
//         console.error('Error fetching team files:', error);
//       }
//     };

//     fetchFiles();
//   }, [teamId]);

//   const handleFileDownload = (fileUrl) => {
//     const filename = fileUrl.split('/').pop();
//     download(fileUrl, filename);
// };

//   const formatDateTime = (dateTimeString) => {
//     const dateTime = new Date(dateTimeString);
//     return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
//   };

//   return (
//     <Segment>
//       <Icon name='folder open' />
//       Files
//       <List divided relaxed>
//         {teamFiles.map(file => (
//           // Only render if msgContent exists and taskContent does not exist
//           file.msgContent && !file.taskContent && (
//             <List.Item key={file._id}>
//               <List.Icon name='file' />
//               <List.Content>
//                 <List.Header as='a' onClick = {() => {handleFileDownload(`https://collab-app-backend.onrender.com/files${file.msgContent}`)}} target='_blank'>{file.msgContent.split('/').pop()}</List.Header>
//                 {/* Assuming msgContent contains the file URL */}
//               </List.Content>
//             </List.Item>
//           )
//         ))}
//       </List>
//     </Segment>
//   );
// };

// export default TeamFiles;

import React, { useState, useEffect } from 'react';
import { List, Icon, Segment, Divider } from 'semantic-ui-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import useDownloader from 'react-use-downloader';

const TeamFiles = () => {
  const [teamFiles, setTeamFiles] = useState([]);
  const location = useLocation();
  const teamId = location.state.teamId;
  const { download } = useDownloader();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`https://collab-app-backend.onrender.com/files/${teamId}`);
        setTeamFiles(response.data.uploadedContents);
      } catch (error) {
        console.error('Error fetching team files:', error);
      }
    };

    fetchFiles();
  }, [teamId]);

  const handleFileDownload = (fileUrl) => {
    const filename = fileUrl.split('/').pop();
    download(fileUrl, filename);
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
  };

  return (
    <div style={{padding:"50px"}}>
      <Segment>
        <Icon name='folder open' size='large' style={{ marginRight: '10px' }} />
        <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Files</span>
        <Divider></Divider>
        <List divided relaxed style={{ marginTop: '1em' }}>
          {teamFiles.map((file) => (
            file.msgContent && !file.taskContent && (
              <List.Item key={file._id}>
                <List.Icon name='file' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header
                    as='a'
                    onClick={() =>
                      handleFileDownload(
                        `https://collab-app-backend.onrender.com/files${file.msgContent}`
                      )
                    }
                    style={{ fontSize: '1.1em', cursor: 'pointer' }}
                  >
                    {file.msgContent.split('/').pop()}
                  </List.Header>
                </List.Content>
              </List.Item>
            )
          ))}
        </List>
      </Segment>
    </div>
  );
};

export default TeamFiles;
