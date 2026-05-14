const q = '[out:json][timeout:25];(node(around:25000,40.7128,-74.0060)["amenity"="hospital"];way(around:25000,40.7128,-74.0060)["amenity"="hospital"];);out center;';
fetch('https://overpass-api.de/api/interpreter', {method:'POST', body: q})
  .then(r => r.text())
  .then(t => console.log(t.substring(0, 100)))
  .catch(console.error);
