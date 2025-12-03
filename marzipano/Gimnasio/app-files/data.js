var APP_DATA = {
  "scenes": [
    {
      "id": "0-gimnasio-a",
      "name": "Gimnasio A",
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
        "yaw": 2.1537081941317684,
        "pitch": 0.37637790950469174,
        "fov": 1.3633411682890908
      },
      "linkHotspots": [
        {
          "yaw": 2.1537082340723535,
          "pitch": 0.3763778968366971,
          "rotation": 0,
          "target": "1-gimnasio-b"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-gimnasio-b",
      "name": "Gimnasio B",
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
        "yaw": 2.1894538767690186,
        "pitch": 0.2903908007046656,
        "fov": 1.3633411682890908
      },
      "linkHotspots": [
        {
          "yaw": 2.057402755848887,
          "pitch": 0.36636472961306765,
          "rotation": 0,
          "target": "2-gimnasio-c"
        },
        {
          "yaw": -1.0367406260621763,
          "pitch": 0.34404956742713466,
          "rotation": 0,
          "target": "0-gimnasio-a"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-gimnasio-c",
      "name": "Gimnasio C",
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
        "yaw": 2.8565751044463603,
        "pitch": 0.2715328194443849,
        "fov": 1.3633411682890908
      },
      "linkHotspots": [
        {
          "yaw": -2.607017515220811,
          "pitch": 0.6762663390171628,
          "rotation": 0,
          "target": "3-vestidores"
        },
        {
          "yaw": 1.782112616177769,
          "pitch": 0.3922924810866846,
          "rotation": 0,
          "target": "1-gimnasio-b"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-vestidores",
      "name": "Vestidores",
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
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.97925960597483,
          "pitch": 0.3581711621866308,
          "rotation": 0,
          "target": "2-gimnasio-c"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Gimnasio",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": true,
    "viewControlButtons": false
  }
};
