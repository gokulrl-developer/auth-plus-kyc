// import { useState, useRef } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Layout from '../components/Layout';
// import { Camera, Video, X } from 'lucide-react';

// export default function Profile() {
//   const { user } = useAuth();
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
//   const [isCapturingImage, setIsCapturingImage] = useState(false);
//   const [isRecordingVideo, setIsRecordingVideo] = useState(false);
//   const [error, setError] = useState('');

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const mediaStreamRef = useRef<MediaStream | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);

//   const startImageCapture = async () => {
//     setError('');
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       mediaStreamRef.current = stream;

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }

//       setIsCapturingImage(true);
//     } catch (err) {
//       setError('Failed to access camera. Please grant camera permissions.');
//       console.error('Camera error:', err);
//     }
//   };

//   const captureImage = () => {
//     if (!videoRef.current) return;

//     const canvas = document.createElement('canvas');
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext('2d');

//     if (ctx) {
//       ctx.drawImage(videoRef.current, 0, 0);
//       const imageUrl = canvas.toDataURL('image/png');
//       setCapturedImage(imageUrl);
//       stopMediaStream();
//       setIsCapturingImage(false);
//     }
//   };

//   const startVideoRecording = async () => {
//     setError('');
//     chunksRef.current = [];

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });
//       mediaStreamRef.current = stream;

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }

//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: 'video/webm' });
//         const videoUrl = URL.createObjectURL(blob);
//         setRecordedVideo(videoUrl);
//         setIsRecordingVideo(false);
//       };

//       mediaRecorder.start();
//       setIsRecordingVideo(true);
//     } catch (err) {
//       setError('Failed to access camera/microphone. Please grant necessary permissions.');
//       console.error('Recording error:', err);
//     }
//   };

//   const stopVideoRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       stopMediaStream();
//     }
//   };

//   const stopMediaStream = () => {
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach(track => track.stop());
//       mediaStreamRef.current = null;
//     }
//   };

//   const cancelCapture = () => {
//     stopMediaStream();
//     setIsCapturingImage(false);
//     setIsRecordingVideo(false);
//   };

//   const clearImage = () => setCapturedImage(null);
//   const clearVideo = () => {
//     if (recordedVideo) {
//       URL.revokeObjectURL(recordedVideo);
//     }
//     setRecordedVideo(null);
//   };

//   return (
//     <Layout>
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
//           <h2 className="text-2xl font-bold text-white mb-4">Profile Information</h2>
//           <div className="space-y-2">
//             <div className="flex items-center">
//               <span className="text-gray-400 w-24">Email:</span>
//               <span className="text-white">{user?.email}</span>
//             </div>
//           </div>
//         </div>

//         <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6">
//           <h2 className="text-2xl font-bold text-white mb-6">KYC Verification</h2>

//           {error && (
//             <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-6">
//               {error}
//             </div>
//           )}

//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
//                 <Camera size={20} />
//                 <span>Image KYC</span>
//               </h3>
//               <p className="text-gray-400 text-sm">
//                 Capture a live photo using your camera for identity verification.
//               </p>
//               <p className="text-gray-500 text-xs">
//                 Uses: MediaDevices API (getUserMedia)
//               </p>

//               {!isCapturingImage && !capturedImage && (
//                 <button
//                   onClick={startImageCapture}
//                   className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
//                 >
//                   <Camera size={18} />
//                   <span>Capture Image</span>
//                 </button>
//               )}

//               {isCapturingImage && (
//                 <div className="space-y-4">
//                   <video
//                     ref={videoRef}
//                     className="w-full rounded-lg bg-black"
//                     autoPlay
//                     playsInline
//                     muted
//                   />
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={captureImage}
//                       className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
//                     >
//                       Take Photo
//                     </button>
//                     <button
//                       onClick={cancelCapture}
//                       className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {capturedImage && (
//                 <div className="space-y-4">
//                   <img
//                     src={capturedImage}
//                     alt="Captured"
//                     className="w-full rounded-lg border border-white/20"
//                   />
//                   <button
//                     onClick={clearImage}
//                     className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
//                   >
//                     Clear Image
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
//                 <Video size={20} />
//                 <span>Video KYC</span>
//               </h3>
//               <p className="text-gray-400 text-sm">
//                 Record a short video clip using your camera and microphone.
//               </p>
//               <p className="text-gray-500 text-xs">
//                 Uses: MediaRecorder API + getUserMedia
//               </p>

//               {!isRecordingVideo && !recordedVideo && (
//                 <button
//                   onClick={startVideoRecording}
//                   className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
//                 >
//                   <Video size={18} />
//                   <span>Record Video</span>
//                 </button>
//               )}

//               {isRecordingVideo && (
//                 <div className="space-y-4">
//                   <video
//                     ref={videoRef}
//                     className="w-full rounded-lg bg-black"
//                     autoPlay
//                     playsInline
//                     muted
//                   />
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={stopVideoRecording}
//                       className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
//                     >
//                       Stop Recording
//                     </button>
//                     <button
//                       onClick={cancelCapture}
//                       className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {recordedVideo && (
//                 <div className="space-y-4">
//                   <video
//                     src={recordedVideo}
//                     controls
//                     className="w-full rounded-lg border border-white/20"
//                   />
//                   <button
//                     onClick={clearVideo}
//                     className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
//                   >
//                     Clear Video
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }
