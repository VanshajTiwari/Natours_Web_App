/* eslint-disable*/
const locations=JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1IjoidmFuc2hhanQwMSIsImEiOiJjbHJjYnZtMTUwNTdxMnJwaDNnd3VtejUxIn0.PgsIauJtDo3YCFeAwPmmHA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    // center:[26.790172, 82.197795],
    // zoom:2,
    // interactive:false
});

const bounds=new mapboxgl.LngLatBounds();
locations.forEach(loc=>{
    //CReate Marker
    const el=document.createElement('div');
    el.className='marker';
//Add Marker
  new mapboxgl.Marker({
        anchor:'bottom',
        element:el,
    }).setLngLat(loc.coordinates).addTo(map);
//Extend map bounds to include current location
    bounds.extend(loc.coordinates)
});
map.fitBounds(bounds,{padding:{
    top:200,
    left:100,
    right:100,
    bottom:200
}});
