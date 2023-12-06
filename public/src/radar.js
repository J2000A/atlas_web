/*******************************
 * radar.js                    *
 * Script file for Radar Plots *
 * Author: Héctor Ochoa Ortiz  *
 * Affil.: TUM SVP             *
 * Last update: 2023-05-03     *
 *******************************/

var currentLayer;

let labels = [
  "value_h",
  "value_e",
  "value_f",
  "value_s",
  "value_cc",
  "value_acc_pt",
  "value_cycleway_density",
  "value_intersection_density",
  "value_walk_usage",
  "value_car_sharing_usage",
  "value_bike_usage",
  "value_pt_usage",
  "value_accidents",
  "value_noise",
  "value_pollution",
  "value_income",
  "value_tp",
  "value_u18",
  "value_o65",
  "value_ng"
]

var radar;
var averages;

function radarPlot(e) {
  currentLayer = e.target;
  var properties = currentLayer.feature.properties;

  const config = {
    type: 'radar',
    data: {
      labels: labels.map(x => {
        // Tries to find the string "radar_<variable_name>" in the translation
        // If not found, just ask for the translation of <variable_name>
        let varName = x.split("value_")[1];
        let tS = translateString("radar_" + varName);
        if (tS == "radar_" + varName || tS == "") {
          tS = translateString(varName);
        }
        return tS;
      }),
      datasets: [
        {
          label: properties.name,
          data: labels.map(x => properties[x]),
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          borderJoinStyle: 'round',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        },
        {
          label: translateString("avg_munich"),
          data: labels.map(x => averages[x]),
          fill: true,
          backgroundColor: 'rgba(150, 150, 150, 0.2)',
          borderColor: 'rgb(150, 150, 150)',
          borderJoinStyle: 'round',
          pointBackgroundColor: 'rgb(150, 150, 150)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(150, 150, 150)'
        }
      ]
    },
    options: {
      aspectRatio: 1.4,
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
          animate: false,
          angleLines: {
            display: true
          },
          suggestedMin: -0.2,
          suggestedMax: 1,
          pointLabels:{
            color: [
              ...Array(5).fill('#e41a1c'),
              ...Array(3).fill('#377eb8'),
              ...Array(4).fill('#4daf4a'),
              ...Array(3).fill('#984ea3'),
              ...Array(5).fill('#072140'),
            ],
            font: {
              size: 9
            },
            centerPointLabels: false
          },
        }
      },
      locale: document.querySelector("[data-i18n-switcher]").value
    },
  };

  return new Chart(document.getElementById('radar'), config);
}

function setAverage(data) {
  let found = data.features.find(element => element.properties["bzt_id"] == null);
  averages = found.properties;
}

function handleJsonRadar(data) {
  biv = false;

  setAverage(data);

  // Add data to download button
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  download.setAttribute("href", dataStr);
  download.setAttribute("download", "data.geojson");

  // If layer is empty, show error message and return
  if (data.features.length == 0) {
      alert('Error while querying, no features found.');
      return;
  }

  function style(feature) {
      return {
          fillColor: '#e8ae43',
          weight: 1,
          opacity: 1,
          color: 'grey',
          fillOpacity: 0.5
      };
  }

  var legend_text = '<h4>No neighbourhood selected</h4>';
  generateLegend(legend_text, true);

  // Callback when selecting a neighbourhood on the map
  function onClick(e) {
    // Remove the style, in case a previous neighbourhood was selected
    polygonLayer.resetStyle();

    // Zoom to the selected neighbourhood
    zoomToFeature(e);

    // Set style of the selected neighborhood
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.9
    });
    layer.bringToFront();

    // Generate the radar plot
    generateLegend('<div class="radar"><canvas id="radar"></canvas><div i18n="radar_norm" style="font-size:smaller;font-style:italic"></div></div>', true);
    radar = radarPlot(e);
  }

  function onEachFeature(feature, layer) {
      layer.on({
          click: onClick
      });
  }

  polygonLayer = L.geoJson(data, {
      attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
      style: style,
      onEachFeature: onEachFeature
  }).addTo(map);

  translatePage();

  // Select one neighbourhood to start with
  polygonLayer.getLayers().find(layer => layer.feature.properties.name == "Königsplatz").fireEvent('click');
  map.fitBounds(polygonLayer.getBounds());
}