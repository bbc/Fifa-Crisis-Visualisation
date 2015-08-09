  var info = document.getElementById('info');


        var map = L.map('map', { zoomControl: false }).setView([47.381604, 8.574487], 3);

    
        L.tileLayer.provider('Stamen.Toner').addTo(map);


        var geoJsonData = [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [8.74512, 47.36115]
                },
                properties: {
                    title: 'Zurich',
                    description: '<em>Wow</em>, this tooltip is breaking all the rules.',
                    'marker-color': '#548cba'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [24.52148, -31.72817]
                },
                properties: {
                    title: 'South Africa',
                    description: 'Another marker, including <a href="http://mapbox.com">a link</a>.',
                    'marker-color': '#548cba'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [50.97656, 24.40714]
                },
                properties: {
                    title: 'Qatar',
                    description: 'Another marker, including <a href="http://mapbox.com">a link</a>.',
                    'marker-color': '#548cba'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [56.60156, 59.97701]
                },
                properties: {
                    title: 'Russia',
                    description: 'Another marker, including <a href="http://mapbox.com">a link</a>.',
                    'marker-color': '#548cba'
                }
            }
        ];

        var myLayer = L.geoJson().addTo(map);
        myLayer.addData(geoJsonData);


  
        // Listen for individual marker clicks.
        myLayer.on('click',function(e) {
        // Force the popup closed.
        e.layer.closePopup();

        var feature = e.layer.feature;
        var content = '<div><strong>' + feature.properties.title + '</strong>' +
                  '<p>' + feature.properties.description + '</p></div>';

        info.innerHTML = content;
        });

        myLayer.on('click',function(e) {
        // Force the popup closed.
        e.layer.closePopup();

        var feature = e.layer.feature;
        var content = '<div><strong>' + feature.properties.title + '</strong>' +
                  '<p>' + feature.properties.description + '</p></div>';

        info.innerHTML = content;

        //map.setView(e.latlng, 5, {animate: true});



        });


        myLayer.on('mouseover',function(e) {

        var feature = e.layer.feature;
        var content = '<div><strong>' + feature.properties.title + '</strong>' +
                  '<p>' + feature.properties.description + '</p></div>';

        e.layer.bindPopup(feature.properties.title);

        e.layer.openPopup();

                  console.log('3');


        });

        myLayer.on('mouseout',function(e) {

         e.layer.closePopup();

        });



// Clear the tooltip when map is clicked.
map.on('move', empty);

// Trigger empty contents when the script
// has loaded on the page.
empty();

function empty() {
  info.innerHTML = '<div><strong>Click a marker</strong></div>';
  }

  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);




  var menu = document.getElementById('menu');

// Iterate through each feature layer item, build a
// marker menu item and enable a click event that pans to + opens
// a marker that's associated to the marker item.
   myLayer.eachLayer(function(marker) {
  var link = menu.appendChild(document.createElement('a'));
  link.className = 'item';
  link.href = '#';

  // Populate content from each markers object.
  link.innerHTML = marker.feature.properties.title +
    '<br /><small>' + marker.feature.properties.description + '</small>';
  link.onclick = function() {
    if (/active/.test(this.className)) {
      this.className = this.className.replace(/active/, '').replace(/\s\s*$/, '');
    } else {
      var siblings = menu.getElementsByTagName('a');
      for (var i = 0; i < siblings.length; i++) {
        siblings[i].className = siblings[i].className
          .replace(/active/, '').replace(/\s\s*$/, '');
      };
      this.className += ' active';

      // When a menu item is clicked, animate the map to center
      // its associated marker and open its popup.
      map.panTo(marker.getLatLng());
      marker.bindPopup(marker.feature.properties.title);
      marker.openPopup();
    }
    return false;
  };
});














/* 
It's worth noting you can also swap the CRS on the fly if you need to swap between a vector layer and a tile layer
*/

// swap back to standard zoom



        

