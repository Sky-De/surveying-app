import { convertgeoToUTM, GeoInput } from '@/utils/convertToUtm';
import React, { useState } from 'react';

export default function ConvertGeoFile() {
  const [geoInput, setGeoInput] = useState<GeoInput[] | null>(null);
  const fileName = 'utm_output.txt';
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const parsedData: GeoInput[] = [];

      for (const line of lines) {
        const parts = line.split(/\s+/); // Split by any whitespace or tab
        if (parts.length < 4) continue;

        const [type, lat, lon, alt] = parts;
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const altitude = parseFloat(alt);

        if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(altitude)) {
          parsedData.push({ type, latitude, longitude, altitude });
        }
      }

      if (parsedData.length > 0) {
        setGeoInput(parsedData);
      } else {
        alert('Failed to parse input file.');
      }
    };

    reader.readAsText(file);
  };

  const handleConvertAndDownload = () => {
    if (!geoInput) return alert('No input data loaded.');

    const utmData = convertgeoToUTM(geoInput);
    const output = utmData
      .map(
        d =>
          `${d.type}\t${d.easting.toFixed(3)}\t${d.northing.toFixed(3)}\t${d.zone}\t${d.altitude}`
      )
      .join('\n');

    const blob = new Blob([output], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="p-4 max-w-xl mx-auto border rounded shadow space-y-4 mt-10">
      <h2 className="text-lg font-bold">Geo to UTM File Converter</h2>
<label htmlFor="fileInput">
  Upload a .txt file with the following format:
  <br />
  <code className='text-green-300'>type latitude longitude altitude</code>
  <br />
 <div className='p-2 border-2 m-2'> 
<input
name='fileInput'
id='fileInput'
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        className="block"
      /></div>
</label>

<hr />

      <button
        onClick={handleConvertAndDownload}
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Convert & Download
      </button>

      {geoInput && <p className="text-green-600">Loaded {geoInput.length} records.</p>}
    </div>
  );
}
