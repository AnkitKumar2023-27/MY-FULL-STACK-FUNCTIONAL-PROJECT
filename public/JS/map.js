 mapboxgl.accessToken = map_token;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      center:listings.geometry.coordinates , // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom:11 // starting zoom

  });

 const marker= new mapboxgl.Marker({color:"red"})
 .setLngLat(listings.geometry.coordinates)
 .setPopup(new mapboxgl.Popup({offset:25})      
.setHTML(`<h4>${listings.location}</h4><p>Exact location Providing after booking</p>`))
 .addTo(map);
