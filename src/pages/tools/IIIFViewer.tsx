
import { useEffect } from 'react';
import AddHostDialog from '@/components/tools/iiif/AddHostDialog';
import ManifestDatabase from '@/components/tools/iiif/ManifestDatabase';
import ViewerCard from '@/components/tools/iiif/ViewerCard';
import IIIFViewerLayout from '@/components/tools/iiif/IIIFViewerLayout';
import { useIIIFManifest } from '@/hooks/use-iiif-manifest';

const IIIFViewer = () => {
  const {
    manifestUrl,
    setManifestUrl,
    activeManifest,
    isLoadingManifest,
    hosts,
    isLoadingData,
    newHostName,
    isAddHostDialogOpen,
    setIsAddHostDialogOpen,
    manifestData,
    setManifestData,
    loadIIIFData,
    loadManifest,
    saveManifest,
    saveManifestToDatabase,
    loadSavedManifest,
  } = useIIIFManifest();

  // Load saved manifests on component mount
  useEffect(() => {
    loadIIIFData();
  }, []);

  const confirmAddHost = async () => {
    await saveManifestToDatabase(newHostName);
    setIsAddHostDialogOpen(false);
  };

  const manifestSection = (
    <ViewerCard
      manifestUrl={manifestUrl}
      setManifestUrl={setManifestUrl}
      activeManifest={activeManifest}
      isLoadingManifest={isLoadingManifest}
      onLoadManifest={loadManifest}
      onSaveManifest={saveManifest}
      manifestData={manifestData}
      onManifestLoad={(data) => setManifestData(data)}
    />
  );

  const databaseSection = (
    <ManifestDatabase 
      hosts={hosts}
      isLoadingData={isLoadingData}
      onSelectManifest={loadSavedManifest}
    />
  );

  return (
    <>
      <IIIFViewerLayout 
        manifestSection={manifestSection}
        databaseSection={databaseSection}
      />
      
      <AddHostDialog 
        isOpen={isAddHostDialogOpen}
        onOpenChange={setIsAddHostDialogOpen}
        hostName={newHostName}
        onConfirm={confirmAddHost}
      />
    </>
  );
};

export default IIIFViewer;
