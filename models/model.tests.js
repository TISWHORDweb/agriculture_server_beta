const mongoose = require("mongoose");

const SoilDataSchema = new mongoose.Schema({
  uniqueId: { type: String  },
  adminId: { type: String, required: true }, 
  state: { type: String  },
  lga: { type: String  },
  ward: { type: String  },
  latitude: { type: Number  },
  longitude: { type: Number  },
  nitrogen: { type: Number  },
  phosphorus: { type: Number  },
  potassium: { type: Number  },
  pH: { type: Number  },
  calcium: { type: Number  },
  magnesium: { type: Number  },
  iron: { type: Number  },
  manganese: { type: Number  },
  boron: { type: Number  },
  copper: { type: Number  },
  zinc: { type: Number  },
  cec: { type: Number  },
  organicMatter: { type: Number  },
  cn: { type: Number  },
  texture: { type: String  },
  source: { type: String  },
});

module.exports = mongoose.model("SoilData", SoilDataSchema);