import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Camera, Video, X } from "lucide-react";
import { toast } from "sonner";
import { KYCMediaMIMETypes } from "../constants/kyc-media-MIMEtypes";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import {
  getUserProfileAPI,
  uploadImageAPI,
  uploadVideoAPI,
} from "../services/userService";

export default function Profile() {
  const { user } = useAuth();
  const [imageError, setImageError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [imageStream, setImageStream] = useState<MediaStream | null>(null);
  const imagePreviewRef = useRef<HTMLVideoElement | null>(null);
  const [imageCaptured, setImageCaptured] = useState<Blob | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const [capturedVideoBlob, setCapturedVideoBlob] = useState<Blob | null>(null);
  const [isVideoCapturing, setIsVideoCapturing] = useState(false);
  const videoCaptureTimerId = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");

  const { setUser, removeLocalStorageUser } = useAuth();
  const { handleApiError } = useApiErrorHandler(
    setUser,
    removeLocalStorageUser
  );
  const VIDEO_KYC_RULES = {
    MIN_SIZE_BYTES: 200 * 1024, // 200 KB
    MAX_SIZE_BYTES: 20 * 1024 * 1024, // 20 MB
    MIN_DURATION_SEC: 5,
    MAX_DURATION_SEC: 15,
  };
  const IMAGE_KYC_RULES = {
    MIN_SIZE: 5 * 1024, // 5 KB
    MAX_SIZE: 5 * 1024 * 1024, // 5 MB
  };

  useEffect(() => {
    fetchProfile();
    console.log(imageUrl);
  }, []);
  // handle previewing camera output for image KYC

  const startImageStream = async () => {
    try {
      if (videoStream) {
        toast.error("Please turn off video capturing");
        return;
      }
      const imgStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setImageStream(imgStream);
    } catch (error) {
      if (error) {
        console.log(error);
        toast.error(
          "Can't proceed .Turn off microphone / camera if already using."
        );
      }
    }
  };

  // handle stoping previewing camera output for image KYC

  const stopImageStream = async () => {
    imageStream?.getTracks().forEach((track) => track.stop());
    setImageStream(null);
  };

  const captureImage = async () => {
    if (imageCaptured !== null) {
      toast.error("Already a captured image exists.");
      return;
    }
    if (
      !imageStream ||
      !imagePreviewRef.current ||
      imagePreviewRef.current.videoHeight === 0 ||
      imagePreviewRef.current.videoWidth === 0
    ) {
      toast.error("Some error occured.Please try again...");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.height = imagePreviewRef.current.videoHeight;
    canvas.width = imagePreviewRef.current.videoWidth;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Cannot get canvas context!");
      return;
    }

    ctx.drawImage(imagePreviewRef.current, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL(KYCMediaMIMETypes.IMAGE_MIME_TYPE);
    const imageBlob = dataURLToBlob(imageDataUrl);
    setImageCaptured(imageBlob);
    stopImageStream();
  };

  const clearImage = () => {
    setImageCaptured(null);
    stopImageStream();
    setImageError("");
  };

  // handle previewing camera output for video KYC

  const startVideoStream = async () => {
    try {
      if (imageStream) {
        toast.error("Please stop image capturing to continue.");
        return;
      }
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setVideoStream(videoStream);
    } catch (error) {
      if (error) {
        console.log(error);
        toast.error(
          "Can't proceed .Turn off microphone / camera if already using."
        );
      }
    }
  };

  // handle stoping previewing camera output for video KYC

  const stopVideoStream = async () => {
    videoStream?.getTracks().forEach((track) => track.stop());
    setVideoStream(null);
  };

  const startVideoRecording = async () => {
    try {
      if (imageStream) {
        toast.error("Please turn off image capturing");
        return;
      }
      if (!videoStream) {
        toast.error("Some internal error occured.Please try again later...");
        return;
      }

      if (
        !MediaRecorder.isTypeSupported(KYCMediaMIMETypes.VIDEO_MIME_TYPE[0]) ||
        !MediaRecorder.isTypeSupported(KYCMediaMIMETypes.VIDEO_MIME_TYPE[1])
      ) {
        toast.error("Video format not supported in this browser.");
        return;
      }
      const audioTrack = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((s) => s.getAudioTracks()[0]);
      videoStream.addTrack(audioTrack);
      const mediaRecorder = new MediaRecorder(videoStream, {
        mimeType: KYCMediaMIMETypes.VIDEO_MIME_TYPE[0]
          ? KYCMediaMIMETypes.VIDEO_MIME_TYPE[0]
          : KYCMediaMIMETypes.VIDEO_MIME_TYPE[1],
      });
      setIsVideoCapturing(true);
      const recordedVideoChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedVideoChunks.push(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        toast.error("Recording failed. Please try again.");
        cancelVideoRecording();
      };
      mediaRecorder.start(1000);
      videoCaptureTimerId.current = setTimeout(() => {
        finishVideoRecording(mediaRecorder, recordedVideoChunks);
      }, 15000);
    } catch (error) {
      console.log(error);
      toast.error("");
    }
  };

  const finishVideoRecording = async (
    recorder: MediaRecorder,
    recordedChunks?: Blob[]
  ) => {
    if (recorder) {
      recorder.stop();

      if (recordedChunks && recordedChunks.length > 0) {
        const recordedBlob = new Blob(recordedChunks, {
          type: recorder.mimeType,
        });
        setCapturedVideoBlob(recordedBlob);
      }
    }
    setIsVideoCapturing(false);
    stopVideoStream();
  };

  const cancelVideoRecording = async () => {
    if (videoCaptureTimerId.current) {
      clearTimeout(videoCaptureTimerId.current);
    }
    setIsVideoCapturing(false);
  };
  const clearVideo = async () => {
    setCapturedVideoBlob(null);
    startVideoStream();
    setVideoError("");
  };

  const validateVideo = () => {
    let validationErrors = "";

    if (capturedVideoBlob!.size < VIDEO_KYC_RULES.MIN_SIZE_BYTES) {
      validationErrors += "Video must of atleast 200 KB size";
    }

    if (capturedVideoBlob!.size > VIDEO_KYC_RULES.MAX_SIZE_BYTES) {
      validationErrors += "Maximum video size is 20 MB.";
    }
    if (validationErrors.length > 0) {
      setVideoError(validationErrors);
      return false;
    } else {
      return true;
    }
  };
  const validateImage = () => {
    let validationErrors = "";

    if (imageCaptured!.size < IMAGE_KYC_RULES.MIN_SIZE) {
      validationErrors += "Min: image size allowed is 5 KB";
    }

    if (imageCaptured!.size > IMAGE_KYC_RULES.MAX_SIZE) {
      validationErrors += "Maximum image size is 5 MB.";
    }
    if (validationErrors.length > 0) {
      setImageError(validationErrors);
      return false;
    } else {
      return true;
    }
  };

  const handleImageUpload = async () => {
    try {
      setImageError("");
      const isValid = validateImage();
      if (isValid === false) {
        return;
      }
      const imageUploadResult = await uploadImageAPI({ image: imageCaptured! });
      if (imageUploadResult.imageUrl) {
        setImageUrl(imageUploadResult.imageUrl);
        toast.success(imageUploadResult.message || "Upload successful");
      }
      setImageCaptured(null);
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };

  const handleVideoUpload = async () => {
    try {
      setVideoError("");
      const isValid = validateVideo();
      if (isValid === false) {
        return;
      }
      const videoUploadResult = await uploadVideoAPI({
        video: capturedVideoBlob!,
      });
      if (videoUploadResult.videoUrl) {
        setVideoUrl(videoUploadResult.videoUrl);
        toast.success(videoUploadResult.message || "Upload successful");
      }
      setCapturedVideoBlob(null);
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };
  function dataURLToBlob(dataURL: string): Blob {
    const [header, base64Data] = dataURL.split(",");

    if (!header || !base64Data) {
      throw new Error("Invalid image data URL");
    }

    const mimeMatch = header.match(/data:(.*?);base64/);
    if (!mimeMatch) {
      throw new Error("Invalid image MIME type");
    }

    const mimeType = mimeMatch[1];

    const binary = atob(base64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  }

  async function fetchProfile() {
    try {
      const profileResult = await getUserProfileAPI();
      if (profileResult.profileData.imageUrl) {
        setImageUrl(profileResult.profileData.imageUrl);
      }
      if (profileResult.profileData.videoUrl) {
        setVideoUrl(profileResult.profileData.videoUrl);
      }
    } catch (error) {
      console.log("error fetching profile", error);
      handleApiError(error);
    }
  }
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Profile Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-gray-400 w-24">Email:</span>
              <span className="text-white">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            KYC Verification
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/*  Image KYC */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Camera size={20} />
                <span>Image KYC</span>
              </h3>
              <p className="text-gray-400 text-sm">
                Capture a live photo using your camera for identity
                verification.
              </p>
              {imageError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-6">
                  {imageError}
                </div>
              )}

              {imageUrl.length > 0 && !imageStream && !imageCaptured && (
                <div className="space-y-4">
                  <h1 className="text-white text-md">Image submitted:</h1>
                  <img
                    src={imageUrl}
                    alt="Captured"
                    className="w-full rounded-lg border border-white/20"
                  />
                </div>
              )}

              {!imageStream && (
                <button
                  onClick={() => startImageStream()}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Camera size={18} />
                  <span>Capture Image</span>
                </button>
              )}

              {imageStream && !imageCaptured && (
                <div className="space-y-4">
                  <video
                    className="w-full rounded-lg bg-black"
                    ref={(video) => {
                      if (video) {
                        video.srcObject = imageStream;
                      }
                      imagePreviewRef.current = video;
                    }}
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => captureImage()}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Take Photo
                    </button>
                    <button
                      onClick={() => stopImageStream()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}

              {imageCaptured && (
                <div className="space-y-4">
                  <img
                    src={URL.createObjectURL(imageCaptured)}
                    alt="Captured"
                    className="w-full rounded-lg border border-white/20"
                  />
                  <button
                    onClick={clearImage}
                    className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear Image
                  </button>
                  <button
                    onClick={handleImageUpload}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>
            {/* Video KYC */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Video size={20} />
                <span>Video KYC</span>
              </h3>
              <p className="text-gray-400 text-sm">
                Record a short video clip using your camera and microphone.
              </p>
              {videoError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-6">
                  {videoError}
                </div>
              )}
              {videoUrl && !videoStream && !capturedVideoBlob && (
                <div className="space-y-4">
                  <h1 className="text-white text-md">Video submitted:</h1>
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg border border-white/20"
                  />
                </div>
              )}

              {!videoStream && !capturedVideoBlob && (
                <button
                  onClick={startVideoStream}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Video size={18} />
                  <span>Record Video</span>
                </button>
              )}

              {videoStream && !capturedVideoBlob && (
                <div className="space-y-4">
                  <video
                    ref={(video) => {
                      if (video) {
                        video.srcObject = videoStream;
                        videoPreviewRef.current = video;
                      }
                    }}
                    className="w-full rounded-lg bg-black"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="flex space-x-3">
                    {!isVideoCapturing && (
                      <>
                        <button
                          onClick={stopVideoStream}
                          className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={() => startVideoRecording()}
                          className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Take video
                        </button>
                      </>
                    )}
                    {isVideoCapturing && (
                      <button
                        onClick={() => {
                          cancelVideoRecording();
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        stop record
                      </button>
                    )}
                  </div>
                </div>
              )}

              {capturedVideoBlob && (
                <div className="space-y-4">
                  <video
                    src={URL.createObjectURL(capturedVideoBlob)}
                    controls
                    className="w-full rounded-lg border border-white/20"
                  />
                  <button
                    onClick={clearVideo}
                    className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear Video
                  </button>
                  <button
                    onClick={handleVideoUpload}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
