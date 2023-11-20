import './PlaylistOpen.css'
import { useEffect } from 'react'
import { reducerCases } from '../../Store/constants'

// importing icons 
import { BiTimeFive } from 'react-icons/bi'
import axios from 'axios'
import { useStateProvider } from '../../Store/UserContext'

const PlaylistView = () => {
    const [{ token, selectedPlaylist, selectedPlaylistId }, dispatch] = useStateProvider()
    useEffect(() => {
        const getIntialPlaylist = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
            const selectedPlaylist = {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description.startsWith("<a")
                    ? ""
                    : response.data.description,
                image: response.data.images[0].url,
                tracks: response.data.tracks.items.map(({ track }) => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists.map((artist) => artist.name),
                    image: track.album.images[2].url,
                    duration: track.duration_ms,
                    album: track.album.name,
                    context_uri: track.album.uri,
                    track_number: track.track_number,
                })),
            };
            dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist })
        };
        getIntialPlaylist();
    }, [token,selectedPlaylistId, dispatch])


    const getSongInfo = async (trackId) => {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        console.log(response.data);
        const songData = response.data
        const songInfo = {
            id: songData.id,
            name: songData.name,
            artists: songData.artists.map(artist => artist.name + ', '),
            image: songData.album.images[0].url,
        }
        dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: songInfo })
    }


    const msToMinutes = (ms) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms / 60000) / 1000).toFixed(0)
        return (minutes + ':' + (seconds < 10 ? '0' : '') + seconds)

    }


    return (
        <div id='playlist-container' className="w-full h-full my-1 rounded-sm bg-[#121212] overflow-y-scroll">
            {
                selectedPlaylist && (
                    <>
                        <div className='w-full h-[300px] flex items-center justify-start p-10'>
                            <div className='w-[250px] h-[250px]'>
                                <img src={selectedPlaylist.image} alt={selectedPlaylist.name} className='w-full h-full object-contain' />
                            </div>
                            <div className='px-5'>
                                <span className='text-md text-white font-semibold my-3'>Playlist</span>
                                <h1 className='text-7xl font-bold mt-5'>{selectedPlaylist.name}</h1>
                                <p className='text-white text-md mt-3'>{selectedPlaylist.description}</p>
                            </div>
                        </div>
                        <table id='list' className='w-full h-full flex flex-col px-5'>
                            <thead>
                                <tr className='w-full text-left' id='playlist-head'>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Album</th>
                                    <th><BiTimeFive /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    selectedPlaylist.tracks.map(({ id, name, artists, image, duration, album }, index) => {
                                        return (

                                            <tr className='w-full my-1 hover:bg-[#27282D] py-1 cursor-pointer' id='playlist-body' key={id} onClick={() => getSongInfo(id)}>
                                                <td className='flex items-center justify-center'>{index + 1}</td>
                                                <td>
                                                    <div className='flex items-center justify-start'>
                                                        <img src={image} alt="track" />
                                                        <div className='flex flex-col text-left px-5'>
                                                            <span>{name}</span>
                                                            <span>{artists}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='flex items-center'>
                                                    <span>{album}</span>
                                                </td>
                                                <td className='flex items-center'>
                                                    <span>{msToMinutes(duration)}</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </>
                )
            }
        </div>
    )
}

export default PlaylistView