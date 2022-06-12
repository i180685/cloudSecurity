import logo from './logo.svg';
import './App.css';
// import {fetchData, putData} from './AwsFunctions';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { useState } from 'react';
import { useEffect } from 'react';
import { listSongs } from './graphql/queries';
import { updateSong } from './graphql/mutations';

Amplify.configure(awsconfig);

function App() {

  // const fetchDataFormDynamoDb = () => {
  //   fetchData('users')
  // }

  // const addDataToDynamoDB = async () => {
  //   const userData = {
  //     name:"Faisal",
  //     age:"170"
  //   }
  //   await putData('users' , userData)
  // }

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
}, []);

  const fetchSongs = async () => {
    try {
        const songData = await API.graphql(graphqlOperation(listSongs));
        const songList = songData.data.listSongs.items;
        alert('song list', songList);
        console.log('song list', songList);
        setSongs(songList);
    } catch (error) {
        alert('error on fetching songs', error);
    }
};

const addLike = async idx => {
  try {
      const song = songs[idx];
      song.like = song.like + 1;
      delete song.createdAt;
      delete song.updatedAt;

      const songData = await API.graphql(graphqlOperation(updateSong, { input: song }));
      const songList = [...songs];
      songList[idx] = songData.data.updateSong;
      setSongs(songList);
  } catch (error) {
      console.log('error on adding Like to song', error);
  }
};

  return (
    <div className="App">
     
{/* 
      <button onClick={() => fetchDataFormDynamoDb()}> Fetch </button>
<button onClick={() => addDataToDynamoDB()}> Put </button> */}

<div className="songList">
                {songs.map((song, idx) => {
                    return (
                        <div variant="outlined" elevation={2} key={`song${idx}`}>
                            <div className="songCard">
                                <div aria-label="play">
                                    PLAY
                                </div>
                                <div>
                                    <div className="songTitle">{song.title}</div>
                                    <div className="songOwner">{song.owner}</div>
                                </div>
                                <div>
                                    <div aria-label="like" onClick={() => addLike(idx)}>
                                        LIKE
                                    </div>
                                    {song.like}
                                </div>
                                <div className="songDescription">{song.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

    </div>
  );
}

export default App;
