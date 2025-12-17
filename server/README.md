OpenStreetMap proxy example

This small Express server forwards geocoding requests to OpenStreetMap and adds simple in-memory caching.

Running:

1. Install dependencies (in project root):
   npm install express node-cache node-fetch

2. Start the proxy (optional helper):
   node server/osm-proxy/index.js

3. Example usage from the app or curl:
   GET http://localhost:4000/api/geocode?q=10+Downing+St
   GET http://localhost:4000/api/reverse?lat=51.5034&lon=-0.1276

Notes:
- For production use, add rate-limiting and stronger caching/storage.
- Set a distinct User-Agent when talking to OpenStreetMap (policy requirement).