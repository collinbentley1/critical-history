mapboxgl.accessToken = 'pk.eyJ1IjoiY29sbGluYmVudGxleTEiLCJhIjoiY2tkdjM1dzZwMHYweTJ1bWMyYW5iMndjMiJ9.s7fIIKKYqyWt0wO-nbrZTA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/collinbentley1/ckd3kwqqw060a1iqgtjne8xs3', // stylesheet location
  center: [-72.92504, 41.31171], // starting position [lng, lat]
  zoom: 14.66 // starting zoom
});
map.on('load', function () {
  map.resize();

});
var chapters = {
  'introduction': {
    bearing: 0,
    center: [-72.92504, 41.31171],
    zoom: 14.66,
  },
  'stiles': {
    speed: .3,
    center: [-72.931131, 41.312465],
    marker:[-72.930883, 41.312457], 
    bearing: 167.2,
    zoom: 17.85,
    pitch: 0
  },
  'broadway_the_shops_at_yale': {
    bearing: -9.6,
    center: [-72.929498, 41.311651],
    marker:[-72.930126, 41.311541], 
    zoom: 17.38,
    speed: 0.1,
    pitch: 40
  },
  'the_house': {
    bearing: 155.2,
    speed: .3,
    center: [-72.9329838, 41.3093089],
    marker:[-72.932876, 41.309407], 
    zoom: 18.99
  },
  'aacc_la_casa_cultural_nacc': {
    bearing: 0,
    center: [-72.9312285, 41.3070808],
    marker:[-72.931415, 41.306982], 
    zoom: 18.92,
    pitch: 20,
    speed: 0.3
  },
  'new_haven_green_phelps_gate': {
    bearing: 172,
    center: [-72.928464, 41.308225],
    marker:[-72.927987, 41.308345], 
    zoom: 17.14,
    speed: 0.25
  },
  'grace_hopper': {
    bearing: 172,
    center: [-72.927613, 41.309938],
    marker:[-72.927177, 41.309967], 
    zoom: 18.08,
    pitch: 40,
    speed: .13
  },
  'sae_fraternity': {
    bearing: 119.2,
    center: [-72.9307157, 41.3071148],
    marker:[-72.930670, 41.307210], 
    zoom: 19.32,
    pitch: 20,
    speed:0.25
  },
  'cross_campus': {
    bearing: -61.6,
    center: [-72.927405, 41.310904],
    marker:[-72.927647, 41.310691], 
    zoom: 17.8,
    pitch: 20,
    speed: 0.23
  },
  'yale_police_department': {
    bearing: -61.6,
    center: [-72.928562, 41.316253],
    marker:[-72.928712, 41.315918], 
    speed: 0.4,
    zoom: 18.39,
    pitch: 20
  }        
};
// Get chapters
var chapterNames = Object.keys(chapters);

// Add markers to map
for (var i = 0; i < chapterNames.length; i++) {
  var chapterName = chapterNames[i];
  // Create DOM element for marker
  if (chapters[chapterName].hasOwnProperty('marker')) {
    var el = document.createElement('div');
    el.id = chapterName + '_marker';
    // Add marker to map
    var marker = new mapboxgl.Marker()
      .setLngLat(chapters[chapterName].marker)
      .addTo(map);
  }
}

// On every scroll event, check which element is on screen
document.getElementById('box').onscroll = function() {
  for (var i = 0; i < chapterNames.length; i++) {
    var chapterName = chapterNames[i];
    if (isElementOnScreen(chapterName)) {
      setActiveChapter(chapterName);
      break;
    }
  }
};

// Initial active chapter is first chapter in list
var activeChapterName = chapterNames[0]
function setActiveChapter(chapterName) {
  // Do nothing if current chapter is the active chapter
  if (chapterName === activeChapterName) return;
  map.flyTo(chapters[chapterName]);
  // Set chapter on screen as active chapter
  document.getElementById(chapterName).setAttribute('class', 'active');
  // Set last chapter on screen as no longer active
  document.getElementById(activeChapterName).setAttribute('class', 'box-item');
  activeChapterName = chapterName;
}

// Chapters are identified by name in HTML ids
function isElementOnScreen(id) {
  var element = document.getElementById(id);
  // Get chapter position on screen
  var bounds = element.getBoundingClientRect();
  // Get box position on screen (will vary wrt desktop or mobile)
  var box = document.getElementById('box')
  var box_position = box.getBoundingClientRect()
  //Return whether chapter is within box position on screen
  return bounds.top < box_position.bottom && bounds.bottom > box_position.top;
}
