export type GeoInput = {
    latitude: number;
    longitude: number;
    altitude: number;
    type: string;
  };
  
  export type UTMOutput = {
    easting: number;
    northing: number;
    zone: number;
    type: string;
    altitude: number;
  };
  
  export const geoData: GeoInput[] = [
    {type: "T",latitude: 36.00599874, longitude: 50.68980635, altitude: 1407.4 },
    {type: "T",latitude: 36.006023698, longitude: 50.689780672, altitude: 1407.8 },
    {type: "T",latitude: 36.006043684, longitude: 50.689761387, altitude: 1408.1 },
    {type: "T",latitude: 36.006798092, longitude: 50.689094429, altitude: 1429.3 },
  ];

  
  export function convertgeoToUTM(data: GeoInput[]): UTMOutput[] {
    const a = 6378137;
    const f = 1 / 298.257223563;
    const k0 = 0.9996;
    const e = Math.sqrt(f * (2 - f));
    const results: UTMOutput[] = [];
  
    for (const point of data) {
      const { latitude, longitude, altitude, type } = point;
  
      const zone = Math.floor((longitude + 180) / 6) + 1;
      const lon0 = degToRad((zone - 1) * 6 - 180 + 3);
      const phi = degToRad(latitude);
      const lambda = degToRad(longitude);
  
      const N = a / Math.sqrt(1 - Math.pow(e * Math.sin(phi), 2));
      const T = Math.pow(Math.tan(phi), 2);
      const C = (Math.pow(e, 2) / (1 - Math.pow(e, 2))) * Math.pow(Math.cos(phi), 2);
      const A = (lambda - lon0) * Math.cos(phi);
  
      const M = a * (
        (1 - Math.pow(e, 2) / 4 - 3 * Math.pow(e, 4) / 64 - 5 * Math.pow(e, 6) / 256) * phi
        - (3 * Math.pow(e, 2) / 8 + 3 * Math.pow(e, 4) / 32 + 45 * Math.pow(e, 6) / 1024) * Math.sin(2 * phi)
        + (15 * Math.pow(e, 4) / 256 + 45 * Math.pow(e, 6) / 1024) * Math.sin(4 * phi)
        - (35 * Math.pow(e, 6) / 3072) * Math.sin(6 * phi)
      );
  
      let easting = k0 * N * (A + (1 - T + C) * Math.pow(A, 3) / 6 +
        (5 - 18 * T + T * T + 72 * C - 58 * (Math.pow(e, 2) / (1 - Math.pow(e, 2)))) * Math.pow(A, 5) / 120) + 500000;
  
      let northing = k0 * (M + N * Math.tan(phi) * (
        Math.pow(A, 2) / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24 +
        (61 - 58 * T + T * T + 600 * C - 330 * (Math.pow(e, 2) / (1 - Math.pow(e, 2)))) * Math.pow(A, 6) / 720));
  
      if (latitude < 0) {
        northing += 10000000;
      }
  
      results.push({type, easting, northing, zone, altitude });
    }
  
    return results;
  }
  
  function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  