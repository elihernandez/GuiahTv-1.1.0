import { useState, useEffect } from 'react'
// require('hls.js/dist/hls.min.js')
import Hls from 'hls.js'

export function useHls(video, url, dispatch, movie) {
	// const config = {
	//       initialLiveManifestSize: 10,
	//       maxBufferLength: 60,
	//       progressive: true,
	//       nudgeMaxRetry: 10
	// }
	let hls = new Hls()
	const [error, setError] = useState(false)

	useEffect(() => {
		if(url){
			if (Hls.isSupported()) {
				setError(false)
				hls.attachMedia(video.current)
				hls.on(Hls.Events.MEDIA_ATTACHED, function () {
					hls.loadSource(url)
					hls.on(Hls.Events.MANIFEST_PARSED, function () {
						if(movie){
							if(movie.ResumePos){
								video.current.currentTime = movie.ResumePos / 1000
								dispatch({ type: 'setCurrentTime', payload: movie.ResumePos / 1000 })
								dispatch({ type: 'updateVideoRef', payload: video })
							}
						}
						// video.current.play()
						dispatch({ type: 'setHls', payload: hls })
					})
				})
            
				hls.on(Hls.Events.ERROR, function (event, data) {
					console.log(event, data)
					dispatch({ type: 'updateLoading', payload: false })
                              
					if(event == 'hlsError' && data.details == 'manifestLoadError'){
						hls.destroy()
						dispatch({ type: 'updateLoading', payload: false })
						// dispatch({ type: 'updateData', payload: null })
						dispatch({ type: 'setHls', payload: null })
						setError('Señal no disponible por el momento')
					}

					// if(data.details == "audioTrackLoadError"){
					//       hls.destroy()
					//       dispatch({ type: 'updateLoading', payload: false })
					//       // dispatch({ type: 'updateData', payload: null })
					//       dispatch({ type: 'setHls', payload: null })
					//       setError("Contenido no disponible por el momento")
					// }

					if(data.details == 'bufferStalledError'){
						// hls.destroy()
						hls.startLoad()
						dispatch({ type: 'updateLoading', payload: true })
						// // dispatch({ type: 'updateData', payload: null })
						// dispatch({ type: 'setHls', payload: null })
						// setError("Contenido no disponible por el momento")
					}

					if(data.details == 'audioTrackLoadError'){
						// hls.destroy()
						// hls.recoverMediaError()
						dispatch({ type: 'updateLoading', payload: true })
						// // dispatch({ type: 'updateData', payload: null })
						// dispatch({ type: 'setHls', payload: null })
						// setError("Contenido no disponible por el momento")
					}
					// if (data.fatal) {
					//       switch (data.type) {
					//             case Hls.ErrorTypes.MEDIA_ERROR:
					//                   hls.destroy()
					//                   setError("Señal no disponible por el momento")
					//             break
					//       }
					// }
				})

				hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function(event, data){
					dispatch({ type: 'setAudioTracks', payload: data })
				})
                        
				hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, function(event, data){
					dispatch({ type: 'setSubtitleTracks', payload: data })
				})
			}
		}

		return (() => {
			hls.destroy()
		})
	}, [url])

	return { error, setError }
}