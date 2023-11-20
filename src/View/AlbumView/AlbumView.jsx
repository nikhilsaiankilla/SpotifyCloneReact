import axios from 'axios'
import React, { useEffect } from 'react'
import { useStateProvider } from './../../Store/UserContext'
import { BiTimeFive } from 'react-icons/bi'

import './../PlaylistOpen/PlaylistOpen.css'
import { reducerCases } from '../../Store/constants'

const AlbumView = () => {
  const [{ token, selectedAlbum, selectedAlbumInfo }, dispatch] = useStateProvider()
  useEffect(() => {
    const getSelectedAlbum = async () => {
      const response = await axios.get(`https://api.spotify.com/v1/albums/${selectedAlbumInfo.id}/tracks`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      })
      console.log(response.data);

      const { items } = response.data
      const selectedAlbum = {
        id: selectedAlbumInfo.id,
        image: selectedAlbumInfo.image,
        type: selectedAlbumInfo.type,
        name : selectedAlbumInfo.name,

        tracks: items.map((track) => ({
          id: track.id,
          name: track.name,
          duration: track.duration_ms,
          artist: track.artists.map(artist => artist.name + ", "),
          uri : track.uri
        }))
      }

      dispatch({ type: reducerCases.SET_SELECTED_ALBUM, selectedAlbum })
    }
    getSelectedAlbum()
  }, [])


  const msToMinutes = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms / 60000) / 1000).toFixed(0)
    return (minutes + ':' + (seconds < 10 ? '0' : '') + seconds)

}
  return (
    <div className='w-full h-full my-1 rounded-sm bg-[#121212] overflow-y-scroll' id='playlist-container'>
      {
        selectedAlbum && (
          <>
            <div className='w-full h-[300px] flex items-center justify-start p-10'>
              <div className='w-[250px] h-[250px]'>
                <img src={selectedAlbum.image} alt={selectedAlbum.name} className='w-full h-full object-contain' />
              </div>
              <div className='px-5'>
                <p className='text-md text-white font-semibold my-3'>
                  {selectedAlbum.type}
                </p>
                <h1 className='text-7xl font-bold mt-5'>{selectedAlbum.name}</h1>
              </div>
            </div>
            <table className='w-full h-full px-10'>
              <thead>
                <tr id='album-head' className='text-left pb-4 px-5 border-b-2 border-gray-600'>
                  <th>#</th>
                  <th>Title</th>
                  <th><BiTimeFive /></th>
                </tr>
              </thead>
              <tbody> 
                  {
                    selectedAlbum.tracks.map(({id,name,duration,artist},index) => {
                      return (
                        <tr key={id} id='album-body' className='w-full my-1 hover:bg-[#27282D] px-5 py-3 cursor-pointer rounded-md'>
                          <td className='flex items-center'>
                            {index + 1}
                          </td>
                          <td className='flex flex-col text-left'>
                            <div>
                              {
                                name
                              }
                            </div>
                            <div className='text-xs mt-1 text-gray-300'>
                              {
                                artist
                              }
                            </div>
                          </td>
                          <td className='flex items-center'>
                            {
                              msToMinutes(duration)
                            }
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

export default AlbumView