// Konumlar 2.mp4'ün son karesindeki (loop videosu) bina/alanlara göre
// yüzdesel (x%, y%) olarak yerleştirildi. Bazıları net (maden ocağı, RES,
// hastane, marina, golf sahası), bazıları tahmini (benzinlik/GES, showroom)
// — ekranda görüp ince ayar gerekebilir.
export type MapMarkerDef = {
  locationId: string
  nameKey: string
  x: number
  y: number
}

export const MAP_MARKERS: MapMarkerDef[] = [
  { locationId: 'maden-ocagi', nameKey: 'Mining Site', x: 13, y: 14 },
  { locationId: 'res-santrali', nameKey: 'Wind Power Plant', x: 36, y: 10 },
  { locationId: 'petrokimya', nameKey: 'Petrochemical', x: 17, y: 33 },
  { locationId: 'trafo-merkezi', nameKey: 'Substation', x: 25, y: 54 },
  { locationId: 'fabrika', nameKey: 'Factory', x: 30, y: 40 },
  { locationId: 'ges-santrali', nameKey: 'Solar Power Plant', x: 9, y: 70 },
  { locationId: 'benzinlik-ges', nameKey: 'Gas Station / Solar', x: 14, y: 60 },
  { locationId: 'golf-sahasi', nameKey: 'Golf Course', x: 19, y: 76 },
  { locationId: 'datacenter', nameKey: 'Data Center', x: 45, y: 16 },
  { locationId: 'hastane', nameKey: 'Hospital', x: 57, y: 6 },
  { locationId: 'avm', nameKey: 'Shopping Mall', x: 58, y: 36 },
  { locationId: 'showroom', nameKey: 'Showroom', x: 54, y: 30 },
  { locationId: 'ulasim-altyapi', nameKey: 'Transportation Infrastructure', x: 71, y: 24 },
  { locationId: 'gemi-marina', nameKey: 'Ship, Marina', x: 79, y: 47 },
]
