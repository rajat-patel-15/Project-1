import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, QrCode, Search, ShieldCheck, XCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { binService } from '../../services/api';
import { BinStation } from '../../types';
import { Modal } from '../common/Modal';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStation: (station: BinStation) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectStation,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{
    valid: boolean;
    bin?: BinStation;
    message: string;
  } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const qrRegionRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const sampleStations = [
    { code: 'BIN-COLLEGE-001', name: 'Main Academic Quad' },
    { code: 'BIN-HOSTEL-003', name: 'Hostel Cluster B' },
    { code: 'BIN-LIBRARY-002', name: 'Central Library Atrium' },
    { code: 'BIN-CAFETERIA-004', name: 'Campus Cafeteria' },
    { code: 'BIN-SCI-005', name: 'Science Complex Lab' },
  ];

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setIsVerifying(true);
    setScannedResult(null);

    try {
      const res = await binService.verifyBin(codeToVerify);
      setScannedResult(res);
      if (res.valid && res.bin) {
        // If camera was running, stop it
        stopCamera();
      }
    } catch (err: any) {
      setScannedResult({
        valid: false,
        message: err.message || 'Validation request failed',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!qrRegionRef.current) return;
      
      const html5QrCode = new Html5Qrcode('qr-reader-region');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          handleVerify(decodedText);
        },
        () => {
          // Ignore individual frame errors
        }
      );
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera initiation notice:', err);
      setCameraError('Camera access unavailable or declined. Please use manual ID verification below.');
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && cameraActive) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        // Ignore stop error
      }
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setScannedResult(null);
      setManualCode('');
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleApplyStation = () => {
    if (scannedResult?.valid && scannedResult.bin) {
      onSelectStation(scannedResult.bin);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Physical QR Bin Station Verification"
      subtitle="Verify your physical presence at an official campus eco-station to link verified telemetry to your log."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Verification Success Banner */}
        {scannedResult?.valid && scannedResult.bin && (
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white font-bold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full">
                    Verified Recycling Station
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    {scannedResult.bin.qrCode}
                  </span>
                </div>
                <h4 className="text-base font-bold text-emerald-950 mt-1">
                  {scannedResult.bin.name}
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {scannedResult.bin.locationDescription}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {scannedResult.bin.acceptedTypes.map(type => (
                    <span
                      key={type}
                      className="text-[10px] bg-white text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleApplyStation}
                  className="mt-3.5 w-full eco-button-primary text-xs py-2 gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Use This Verified Station for Logging</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Failure Message */}
        {scannedResult && !scannedResult.valid && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-slide-up">
            <XCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{scannedResult.message}</span>
          </div>
        )}

        {/* Live Camera Scanner Box */}
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-center p-3">
          <div id="qr-reader-region" ref={qrRegionRef} className="w-full min-h-[180px] flex items-center justify-center">
            {!cameraActive && (
              <div className="py-6 px-4 text-slate-400">
                <Camera className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                <p className="text-xs font-medium text-slate-300">Live Camera Feed Inactive</p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Click below to activate device webcam, or use the 1-click test stations.
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Activate Camera Scanner</span>
                </button>
              </div>
            )}
          </div>

          {cameraActive && (
            <button
              onClick={stopCamera}
              className="mt-2 text-xs text-slate-400 hover:text-white underline"
            >
              Turn off camera
            </button>
          )}

          {cameraError && (
            <p className="text-[11px] text-amber-400 mt-2 bg-slate-800/80 p-2 rounded-lg">
              {cameraError}
            </p>
          )}
        </div>

        {/* 1-Click Test Station Selection */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>Click to Simulate QR Scanning:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sampleStations.map(station => (
              <button
                key={station.code}
                onClick={() => {
                  setManualCode(station.code);
                  handleVerify(station.code);
                }}
                className="text-[11px] bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all shadow-2xs"
              >
                {station.code} ({station.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Manual Fallback Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Manual Station ID Entry (Fallback)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. BIN-COLLEGE-001"
              value={manualCode}
              onChange={e => setManualCode(e.target.value.toUpperCase())}
              className="eco-input font-mono"
            />
            <button
              onClick={() => handleVerify(manualCode)}
              disabled={isVerifying || !manualCode.trim()}
              className="eco-button-primary shrink-0 text-xs px-4"
            >
              <Search className="w-3.5 h-3.5 mr-1" />
              <span>{isVerifying ? 'Verifying...' : 'Verify'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
