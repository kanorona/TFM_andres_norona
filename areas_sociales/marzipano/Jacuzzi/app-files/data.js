var APP_DATA = {
  "scenes": [
    {
      "id": "0-jacuzzi-a",
      "name": "Jacuzzi A",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 2752,
      "initialViewParameters": {
        "yaw": -0.03412625555186821,
        "pitch": -0.03163204566796196,
        "fov": 1.3633411682890908
      },
      "linkHotspots": [
        {
          "yaw": -0.005653270544112132,
          "pitch": 0.3991044854225638,
          "rotation": 0,
          "target": "1-jacuzzi-b"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-jacuzzi-b",
      "name": "Jacuzzi B",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 2752,
      "initialViewParameters": {
        "yaw": 3.0431516319214733,
        "pitch": 0.46239977413743816,
        "fov": 1.3633411682890908
      },
      "linkHotspots": [
        {
          "yaw": 3.116090752226027,
          "pitch": 0.6584653708370389,
          "rotation": 0,
          "target": "0-jacuzzi-a"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Jacuzzi",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": true,
    "viewControlButtons": false
  }
};
