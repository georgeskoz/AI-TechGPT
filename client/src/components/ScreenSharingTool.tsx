import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Monitor, MonitorSpeaker, Users, Shield, Play, Square, MousePointer, Eye, EyeOff, Volume2, VolumeX, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScreenSharingSession {
  id: string;
  customerId: number;
  serviceProviderId: number;
  sessionType: 'view-only' | 'remote-control' | 'collaboration';
  status: 'pending' | 'active' | 'ended';
  startTime: Date;
  duration: number;
  customerName: string;
  serviceProviderName: string;
}

interface ScreenSharingToolProps {
  userRole: 'customer' | 'service_provider';
  userId: number;
  sessionId?: string;
}

export default function ScreenSharingTool({ userRole, userId, sessionId }: ScreenSharingToolProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [sessionType, setSessionType] = useState<'view-only' | 'remote-control' | 'collaboration'>('view-only');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const [currentSession, setCurrentSession] = useState<ScreenSharingSession | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const { toast } = useToast();

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    // Initialize WebRTC peer connection
    initializePeerConnection();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializePeerConnection = () => {
    try {
      peerConnectionRef.current = new RTCPeerConnection(rtcConfig);
      
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to remote peer via signaling server
          console.log('ICE candidate:', event.candidate);
        }
      };

      peerConnectionRef.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current.onconnectionstatechange = () => {
        const state = peerConnectionRef.current?.connectionState;
        setConnectionStatus(state === 'connected' ? 'connected' : 
                          state === 'connecting' ? 'connecting' : 
                          state === 'failed' ? 'error' : 'disconnected');
      };
    } catch (error) {
      console.error('Error initializing peer connection:', error);
      setConnectionStatus('error');
    }
  };

  const startScreenSharing = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Request screen sharing permission
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: quality === 'high' ? 1920 : quality === 'medium' ? 1280 : 720,
          height: quality === 'high' ? 1080 : quality === 'medium' ? 720 : 480,
          frameRate: quality === 'high' ? 30 : quality === 'medium' ? 24 : 15
        },
        audio: audioEnabled
      });

      setMediaStream(stream);
      setIsSharing(true);
      setPermissionGranted(true);

      // Display local stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add stream to peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, stream);
        });
      }

      // Create session
      const session: ScreenSharingSession = {
        id: `session_${Date.now()}`,
        customerId: userRole === 'customer' ? userId : 1,
        serviceProviderId: userRole === 'service_provider' ? userId : 1,
        sessionType,
        status: 'active',
        startTime: new Date(),
        duration: 0,
        customerName: userRole === 'customer' ? 'You' : 'Customer',
        serviceProviderName: userRole === 'service_provider' ? 'You' : 'Service Provider'
      };
      
      setCurrentSession(session);
      setConnectionStatus('connected');
      
      toast({
        title: "Screen sharing started",
        description: `${sessionType === 'remote-control' ? 'Remote control' : 'View-only'} session is now active`,
      });

      // Handle stream end
      stream.getVideoTracks()[0].onended = () => {
        stopScreenSharing();
      };

    } catch (error) {
      console.error('Error starting screen sharing:', error);
      setConnectionStatus('error');
      toast({
        title: "Screen sharing failed",
        description: "Unable to start screen sharing. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopScreenSharing = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setIsSharing(false);
    setIsConnected(false);
    setConnectionStatus('disconnected');
    
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: 'ended',
        duration: Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000)
      });
    }
    
    toast({
      title: "Screen sharing ended",
      description: "Session has been terminated",
    });
  };

  const requestRemoteControl = async () => {
    if (userRole === 'service_provider') {
      toast({
        title: "Remote control requested",
        description: "Waiting for customer permission...",
      });
      // In a real implementation, this would send a request to the customer
      setTimeout(() => {
        setSessionType('remote-control');
        toast({
          title: "Remote control granted",
          description: "You can now control the customer's screen",
        });
      }, 2000);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      remoteVideoRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
    }
  };

  const cleanup = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Screen Sharing Tool</CardTitle>
                <CardDescription>
                  {userRole === 'customer' ? 'Share your screen with service providers' : 'View and control customer screens'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="text-sm font-medium">{getConnectionStatusText()}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorSpeaker className="h-5 w-5" />
                {userRole === 'customer' ? 'Your Screen' : 'Customer Screen'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {isSharing || remoteStream ? (
                  <div className="relative w-full h-full">
                    {/* Remote stream (for service providers) */}
                    {userRole === 'service_provider' && (
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        className="w-full h-full object-contain"
                        style={{ backgroundColor: '#000' }}
                      />
                    )}
                    
                    {/* Local stream (for customers) */}
                    {userRole === 'customer' && (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-contain"
                        style={{ backgroundColor: '#000' }}
                      />
                    )}
                    
                    {/* Control overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant={sessionType === 'remote-control' ? 'destructive' : 'secondary'}>
                          {sessionType === 'remote-control' ? 'Remote Control' : 'View Only'}
                        </Badge>
                        {currentSession && (
                          <Badge variant="outline">
                            {Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000)}s
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={toggleAudio}
                          className="bg-white/90 hover:bg-white"
                        >
                          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={toggleFullscreen}
                          className="bg-white/90 hover:bg-white"
                        >
                          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">No screen sharing active</p>
                      <p className="text-sm">Click "Start Sharing" to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          {/* Session Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isSharing ? (
                <div className="space-y-3">
                  <Tabs value={sessionType} onValueChange={(value) => setSessionType(value as any)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="view-only">View Only</TabsTrigger>
                      <TabsTrigger value="remote-control">Remote Control</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quality</label>
                    <select 
                      value={quality} 
                      onChange={(e) => setQuality(e.target.value as any)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="high">High (1080p)</option>
                      <option value="medium">Medium (720p)</option>
                      <option value="low">Low (480p)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="audio"
                      checked={audioEnabled}
                      onChange={(e) => setAudioEnabled(e.target.checked)}
                    />
                    <label htmlFor="audio" className="text-sm">Include audio</label>
                  </div>
                  
                  <Button onClick={startScreenSharing} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Sharing
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button onClick={stopScreenSharing} variant="destructive" className="w-full">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Sharing
                  </Button>
                  
                  {userRole === 'service_provider' && sessionType === 'view-only' && (
                    <Button onClick={requestRemoteControl} variant="outline" className="w-full">
                      <MousePointer className="h-4 w-4 mr-2" />
                      Request Control
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Info */}
          {currentSession && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Session ID</p>
                    <p className="text-gray-600">{currentSession.id}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    <Badge variant={currentSession.status === 'active' ? 'default' : 'secondary'}>
                      {currentSession.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">Started</p>
                    <p className="text-gray-600">{currentSession.startTime.toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Type</p>
                    <p className="text-gray-600">{currentSession.sessionType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {userRole === 'customer' 
                ? 'Only share your screen with trusted service providers. You can stop sharing at any time.'
                : 'Handle customer data with care. All sessions are logged for security purposes.'
              }
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}