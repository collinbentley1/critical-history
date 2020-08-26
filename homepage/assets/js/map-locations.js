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
{{ $locations := (where site.RegularPages "Type" "locations") }}
{{ $locations_count := (len $locations) }}
{{ range $index, $element := sort $locations ".Params.Order" }}
  '{{ .Params.Simple }}': {
    {{ if .Params.Bearing }}bearing: {{ .Params.Bearing }},{{ end }}
    {{ if .Params.Center_Long }}center: [{{ .Params.Center_Long }}, {{ .Params.Center_Lat }}],{{ end }}
    {{ if .Params.Marker_Long }}marker: [{{ .Params.Marker_Long }}, {{ .Params.Marker_Lat }}],{{ end }}
    {{ if .Params.Pitch }}pitch: {{ .Params.Pitch }},{{ end }}
    {{ if .Params.Speed }}speed: {{ .Params.Speed }},{{ end }}
    {{ if .Params.Zoom }}zoom: {{ .Params.Zoom }}{{ end }}
  }{{ if eq (add $index 1) $locations_count }}{{ else }},{{ end }}{{ end }}
};

// Get chapters
var chapterNames = Object.keys(chapters);

// Add markers to map
for (var i = 0; i < chapterNames.length; i++) {
  var chapterName = chapterNames[i];
  // Create DOM element for marker
  if (chapters[chapterName].hasOwnProperty('marker')) {
    var el = document.createElement('div');
    el.className = 'marker';
    console.log(el.id);
    // Add marker to map
    var marker = new mapboxgl.Marker(el)
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
