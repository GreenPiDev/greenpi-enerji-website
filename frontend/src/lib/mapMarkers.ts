// Harita noktalarının pozisyonu (x%, y%) artık admin panelden DB'ye
// yazılıyor (bkz. Location.xPercent/yPercent, /admin/locations ekranı).
// Bu dosya sadece lokasyon id -> i18n çeviri anahtarı eşleşmesini tutuyor;
// konum bilgisinin "source of truth"u değil.
export const LOCATION_NAME_KEYS: Record<string, string> = {
  'maden-ocagi': 'Mining Site',
  'res-santrali': 'Wind Power Plant',
  petrokimya: 'Petrochemical',
  'trafo-merkezi': 'Substation',
  fabrika: 'Factory',
  'ges-santrali': 'Solar Power Plant',
  'benzinlik-ges': 'Gas Station / Solar',
  'golf-sahasi': 'Golf Course',
  datacenter: 'Data Center',
  hastane: 'Hospital',
  avm: 'Shopping Mall',
  showroom: 'Showroom',
  'ulasim-altyapi': 'Transportation Infrastructure',
  'gemi-marina': 'Ship, Marina',
}
