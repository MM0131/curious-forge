import base from './blueprints.json'
// If a full English JSON exists (generated or uploaded), prefer it as the canonical English dataset.
import fullEn from './blueprints.en.full.json'
import type { Blueprint } from '~/types/blueprint'

// Helpers to extract English-ish text when present in parentheses or from ASCII segments,
// plus helpers to pull explicit `en`/`english` fields if the source JSON included them.
const extractParenthesis = (s?: string) => {
  if (!s) return ''
  const m = s.match(/\(([^)]+)\)/)
  if (m && m[1]) return m[1].trim()
  return ''
}

const extractAscii = (s?: string) => {
  if (!s) return ''
  // find all ascii-like substrings and return the longest reasonable one
  const matches = s.match(/[A-Za-z0-9 ,.'"()\-]{6,}/g)
  if (!matches || matches.length === 0) return ''
  matches.sort((a, b) => b.length - a.length)
  return matches[0].trim()
}

const extractFromObject = (o: any) => {
  if (!o) return ''
  return o.en || o.english || o.title_en || o.description_en || o['en-US'] || ''
}

const normalizeString = (s?: string) => {
  if (!s) return ''
  // prefer explicit parenthesis English, then ascii substring, otherwise empty
  return extractParenthesis(s) || extractAscii(s) || ''
}

const mapStep = (s: any) => {
  if (!s) return ''
  if (typeof s === 'string') {
    return normalizeString(s) || s
  }
  // object step - check explicit english fields first, then fallback to title/description
  const fromObj = extractFromObject(s)
  if (fromObj) return fromObj
  return normalizeString(s.title) || normalizeString(s.description) || s.title || s.description || ''
}

const mapMaterial = (m: any) => {
  if (!m) return ''
  if (typeof m === 'string') return normalizeString(m) || m
  const fromObj = extractFromObject(m)
  if (fromObj) return fromObj
  return normalizeString(m.name) || normalizeString(m.item) || m.name || m.item || ''
}

const mapEntry = (b: any): Blueprint => {
  const title = normalizeString(b.title) || b.title || ''
  const purpose = extractFromObject(b) || normalizeString(b.purpose) || extractAscii(b.purpose) || b.purpose || ''

  // Description: try explicit english fields, then parenthesis/ascii heuristics, then original
  const description = b.description_en || b.en_description || normalizeString(b.description) || extractAscii(b.description) || b.description || ''

  const materials = Array.isArray(b.materials) ? b.materials.map(mapMaterial).filter(Boolean) : []
  const steps = Array.isArray(b.steps) ? b.steps.map(mapStep).filter(Boolean) : []

  const warnings = b.warnings || b.safety_notes || normalizeString(b.warnings) || ''
  const sciencePrinciple = b.sciencePrinciple || b.science_explanation || normalizeString(b.sciencePrinciple) || ''
  const funFacts = Array.isArray(b.funFacts) ? b.funFacts.map((f: any) => typeof f === 'string' ? (normalizeString(f) || f) : (extractFromObject(f) || f.text || '')).filter(Boolean) : undefined

  return {
    id: b.id,
    title,
    category: b.category || b.group || '',
    difficulty: b.difficulty || '',
    // Try to translate time unit words (Thai -> English) for better UX when no full translation exists
    time: (function parseTime(t: any) {
      if (!t) return ''
      if (typeof t !== 'string') return String(t)
      let s = t
      s = s.replace(/นาที/g, 'minutes')
      s = s.replace(/ชั่วโมง/g, 'hours')
      s = s.replace(/วัน/g, 'days')
      s = s.replace(/สัปดาห์/g, 'weeks')
      s = s.replace(/เตรียม/g, 'prep')
      // normalize Thai hyphen ranges like "2-4 ชั่วโมง" keep digits and unit
      s = s.replace(/\s+/g, ' ').trim()
      return s
    })(b.time),
    materials,
    steps,
    purpose,
    description,
    sciencePrinciple: sciencePrinciple || undefined,
    funFacts: funFacts && funFacts.length ? funFacts : undefined,
    warnings: warnings || '',
    image: b.image || b.image_url || undefined
  }
}

const mapped = (base as any[]).map(mapEntry)

// Build exported by starting from the mapped base (covers every canonical entry), then overlay
// any user-provided full translations from `blueprints.en.full.json` so the final array is
// guaranteed to contain every blueprint with English fields where available.
let result: Blueprint[] = mapped.slice()

if (Array.isArray(fullEn) && fullEn.length > 0) {
  const fullById = (fullEn as any[]).reduce((acc: Record<string, any>, b: any) => {
    if (b && b.id) acc[b.id] = b
    return acc
  }, {})

  // Overlay translations onto the mapped entries
  result = result.map((e) => {
    if (!e || !e.id) return e
    const f = fullById[e.id]
    if (f) return { ...e, ...f }
    return e
  })

  // Add any extra entries present in fullEn but not in the canonical base (defensive)
  for (const f of (fullEn as any[])) {
    if (f && f.id && !result.some((x) => x.id === f.id)) {
      result.push(f as Blueprint)
    }
  }
}

// If the full English dataset exists but lacks image paths, copy image fields from the original
// `blueprints.json` (the canonical dataset) so the UI can display illustrations.
const baseById: Record<string, any> = (base as any[]).reduce((acc: Record<string, any>, b: any) => {
  if (b && b.id) acc[b.id] = b
  return acc
}, {})

result = result.map((e) => {
  if (e && !e.image) {
    const b = baseById[e.id]
    if (b) {
      e.image = b.image || b.image_url || undefined
    }
  }
  return e
})

// Export at the end after overrides (OVERRIDES) are applied below.

// Manual overrides for entries that need explicit English copy immediately.
// This is non-destructive and only affects the English view; canonical JSON is unchanged.
const OVERRIDES: Record<string, Partial<Blueprint>> = {
  'volcano': {
    title: 'Volcano (Model)',
    purpose: 'Teach acid–base chemical reactions',
    description: 'Build a model volcano that erupts using baking soda and vinegar. This hands-on demo shows an acid–base reaction that releases carbon dioxide gas, producing bubbling “lava” that overflows the volcano.',
    materials: ['Baking soda', 'Vinegar', 'Food coloring', 'Dish soap'],
    steps: ['Prepare the volcano base', 'Mix the ingredients', 'Trigger the reaction and observe'],
    warnings: 'Do not ingest materials. Avoid contact with eyes.'
  },
  'lava-lamp': {
    title: 'Homemade Lava Lamp',
    purpose: 'Teach density differences and immiscibility of liquids',
    description: 'Create a colorful lava lamp using household liquids. The activity demonstrates how liquids with different densities and immiscibility behave, producing rising and sinking blobs of color.',
    materials: ['Water', 'Vegetable oil', 'Salt', 'Dish soap', 'Food coloring'],
    steps: ['Add water and oil to a clear container', 'Drop in food coloring', 'Add salt to create motion and observe the blobs rising and falling'],
    warnings: 'Keep out of reach of small children. Do not ingest.'
  },
  'bridge': {
    title: 'Popsicle Stick Bridge',
    purpose: 'Teach structural design and load distribution',
    description: 'Challenge your engineering skills by designing and building a bridge from popsicle sticks. Test how much load your design can carry and learn about forces, moments and truss structures.',
    materials: ['Popsicle sticks', 'Glue', 'String'],
    steps: ['Design the bridge', 'Construct the structure', 'Perform load testing'],
    warnings: 'Use glue with care and supervise cutting tools.'
  },
  'zeer-pot': {
    title: 'Zeer Pot (Evaporative Cooler)',
    purpose: 'Teach evaporative cooling for food preservation',
    description: 'A simple non-electric cooler made from two earthenware pots and wet sand. Evaporation from the sand cools the inner pot and helps preserve fruits and vegetables.',
    materials: ['Two earthenware pots', 'Sand', 'Water', 'Wet cloth'],
    steps: ['Place the smaller pot inside the larger pot', 'Fill the gap with wet sand', 'Cover with a wet cloth and place in a ventilated spot'],
    warnings: 'Keep the sand moist and avoid placing in very humid locations.'
  }
  ,
  'solar-still': {
    purpose: 'Turn contaminated or salt water into fresh water using solar energy',
    description: 'Learn how to make clean water from seawater or dirty water using only sunlight. This solar still evaporates and condenses water to produce fresh, drinkable water and demonstrates the water cycle and solar energy.',
  },
  'microbial-fuel-cell': {
    purpose: 'Demonstrate electricity generation from microbial activity in soil',
    description: 'Build a simple microbial fuel cell that generates small amounts of electricity from microbes in soil. Over several days bacteria break down organic matter and produce measurable electrical current.',
  },
  'seismograph': {
    purpose: 'Record ground vibrations using a simple inertia-based sensor',
    description: 'Build a basic seismograph to record ground vibrations. A suspended weight attached to a pen traces motion on paper, demonstrating how earthquakes are detected and measured.',
  },
  'casein-plastic': {
    purpose: 'Convert milk protein (casein) into a plastic-like material',
    description: 'Turn milk protein (casein) into a biodegradable plastic. Heat milk and add an acid to form curds, then press and dry them to make a hard, moldable material.',
  },
  'water-rocket': {
    purpose: 'Demonstrate Newton’s action–reaction principle with a water bottle rocket',
    description: 'Launch a bottle rocket powered by water and compressed air. This hands-on activity demonstrates Newton’s action–reaction principle and basic rocketry.',
  },
  'herb-bug-spray': {
    purpose: 'Make a natural insect-repellent spray from aromatic herbs',
    description: 'Make a natural insect-repellent spray using aromatic herbs. Extract essential oils by steeping herbs in alcohol and strain into a spray bottle for safe outdoor use.',
  },
  'backyard-foundry': {
    purpose: 'Recycle scrap aluminum by melting and casting it into new shapes',
    description: 'Build a small backyard foundry to melt and cast scrap aluminum into new shapes. This project demonstrates metal casting techniques but requires strict safety precautions and protective gear.',
  },
  'stirling-engine': {
    purpose: 'Build an external-heat engine that runs on temperature differences (no internal combustion)',
    description: 'Assemble a simple Stirling engine that runs on a temperature difference. It demonstrates how expanding and contracting air can be converted into continuous mechanical motion.',
    sciencePrinciple: 'A Stirling engine is a closed-cycle engine that operates by heating and cooling a working gas. As air is heated it expands, and as it cools it contracts. A design with two pistons — a displacer and a power piston — moves the working gas between the hot and cold regions, producing cyclic expansion and compression that drives the power piston and generates mechanical work.',
    materials: ['Two soda cans', 'Balloon (for seals)', 'Wire', 'Small ball bearings', 'Steel wool (for displacer)', 'Epoxy glue', 'Candle or a cup of hot water'],
    steps: [
      'Build the displacer piston (the part that shuttles air between hot and cold regions)',
      'Assemble all components carefully so the system is sealed and there are no air leaks',
      'Construct a simple crankshaft to convert piston motion into rotation',
      'Adjust the timing between the displacer and the power piston so they operate in the correct phase',
      'Place the engine over a cup of hot water or heat the bottom with a candle to provide the thermal difference'
    ],
    funFacts: ['The Stirling engine was invented by Robert Stirling in 1816', 'NASA has used Stirling engines in some space missions due to their efficiency and low vibration'],
    warnings: 'Be careful with heat sources. Keep hands and loose clothing away from moving parts and hot surfaces; ensure rotating parts are secure and cannot detach.'
  },
  'automated-greenhouse': {
    purpose: 'Create an automated plant-care system using sensors and a microcontroller',
    description: 'Create a mini automated greenhouse that waters plants and provides supplemental light using sensors and a microcontroller. It teaches basic IoT and automation concepts for plant care.',
  },
  'newtonian-telescope': {
    purpose: 'Build a telescope to observe the Moon and planets',
    description: 'Construct a Newtonian telescope to observe the Moon and planets. Learn about mirrors, focal length, and simple astronomical observation techniques.',
  },
  'sundial': {
    purpose: 'Make a sundial to tell time using the Sun’s shadow',
    description: 'Make a functional sundial to track time using the Sun’s shadow. This project helps explain Earth’s rotation and how shadows relate to time of day.',
  },
  'periscope': {
    purpose: 'Use mirrors to see over obstacles and demonstrate reflection',
    description: 'Build a periscope to see over obstacles using two mirrors set at 45°. It demonstrates the law of reflection and optical paths in a playful way.',
  },
  'lemon-battery': {
    purpose: 'Generate electricity from an electrochemical fruit cell',
    description: 'Create a small battery using a lemon, a copper coin and a zinc nail to power an LED. This demonstrates basic electrochemical reactions and how batteries work.',
  },
  'cartesian-diver': {
    purpose: 'Demonstrate pressure transmission and buoyancy using a sealed bottle',
    description: 'Make a Cartesian diver that sinks and floats when you squeeze a sealed bottle. The activity illustrates pressure transmission and buoyancy in a closed system.',
  },
  'camera-obscura': {
    purpose: 'Project an inverted image of the outside world to demonstrate optics',
    description: 'Build a camera obscura to project an inverted image of the outside world onto a screen. It shows the basic optics behind cameras and the human eye.',
  },
  'hydraulic-arm': {
    purpose: 'Build a hydraulic arm that moves using fluid pressure (no electricity)',
    description: 'Build a hydraulic arm controlled by syringes and tubing. The project demonstrates Pascal’s principle and how fluid pressure transmits force to move parts.',
  },
  'weather-station': {
    purpose: 'Assemble a basic, non-electronic weather station to measure wind, rain, and direction',
    description: 'Assemble an analog weather station to measure wind speed, direction, and rainfall. This hands-on kit introduces basic meteorology and weather instruments.',
  },
  'gravity-racer': {
    purpose: 'Build a vehicle that moves using only gravitational potential energy',
    description: 'Build a gravity-powered go-kart that rolls downhill using potential energy converted into motion. This project covers mechanics, design, and safety for downhill vehicles.',
  },
  'crystal-radio': {
    purpose: 'Receive AM radio broadcasts without batteries to demonstrate basic radio reception',
    description: 'Construct a simple crystal radio receiver that picks up AM broadcasts without batteries. It demonstrates antennas, tuning circuits, and basic radio reception.',
  },
  'cloud-chamber': {
    purpose: 'Visualize tracks of ionizing particles using condensed vapor',
    description: 'Build a cloud chamber to visualize tracks left by ionizing particles as faint vapor trails. Requires dry ice and careful handling, but reveals cosmic-ray activity in real time.',
  },
  'aquaponics': {
    purpose: 'Create a small integrated aquaponics ecosystem where fish and plants support each other',
    description: 'Set up a small aquaponics system where fish waste fertilizes plants and plants help clean the water. This integrated system demonstrates the nitrogen cycle and sustainable food production.',
    sciencePrinciple: 'The nitrogen cycle: fish excrete ammonia which nitrifying bacteria convert to nitrite and then nitrate. Plants uptake nitrates as nutrients, filtering and cleaning the water before it returns to the fish tank.',
    materials: [
      'Fish tank',
      'Small water pump',
      'Tubing',
      'Grow bed / tray',
      'Growing medium (expanded clay / hydroton / lava rock)',
      'Fish (e.g. guppies, goldfish)',
      'Plants (lettuce, herbs, leafy greens)'
    ],
    steps: [
      'Set up the fish tank and cycle it so beneficial bacteria establish',
      'Place the grow bed above the tank and add growing medium',
      'Install the pump and connect tubing to circulate water from the tank to the grow bed',
      'Allow water to flow through plant roots and drain back to the tank, creating continuous filtration',
      'Plant seedlings in the grow bed, monitor water parameters, and feed fish as needed'
    ],
    funFacts: [
      'Traditional Aztec chinampas were an early form of integrated aquaculture and agriculture',
      'Aquaponics can use up to 90% less water than conventional soil-based gardening'
    ],
    warnings: 'Monitor water quality, do not overstock the tank, and handle fish/hardware hygienically. Use appropriate filtration and avoid chemicals that could harm fish.'
  },
  'wind-turbine': {
    purpose: 'Design and build a wind turbine to convert wind energy into electricity',
    description: 'Build a small wind turbine that converts wind energy into electricity to charge small devices. Learn about aerodynamics and electromagnetic induction in a renewable energy project.',
  },
  'cnc-plotter': {
    purpose: 'Recycle electronic parts to build a CNC plotter that draws vector graphics',
    description: 'Build a DIY CNC plotter that draws vector graphics using recycled motors and an Arduino. This introduces CNC control, stepper motors, and digital fabrication techniques.',
  },
  'rube-goldberg': {
    purpose: 'Design a chain-reaction machine that performs a simple task to teach sequencing and engineering',
    description: 'Design and build a Rube Goldberg machine — a deliberately overcomplicated chain-reaction device that performs a simple task. This creative engineering challenge focuses on sequencing and problem solving.',
  },
}

// Apply overrides to the exported output so the English view shows these values immediately.
for (let i = 0; i < result.length; i++) {
  const id = result[i].id
  if (OVERRIDES[id]) {
    result[i] = { ...result[i], ...OVERRIDES[id] }
  }
}

// Ensure a full set of English fields for the blueprints the content team provided.
// This is a defensive post-processing step: if any of these entries lack English
// title/purpose/description/materials/steps, overwrite them with the provided copy.
const MANUAL_EN: Record<string, Partial<Blueprint>> = {
  'solar-still': {
    title: 'Solar Still',
    purpose: 'Turn contaminated or salt water into fresh water using solar energy',
    description: 'Build a simple solar still to evaporate and condense water using sunlight. This method can produce small amounts of potable water from brackish or dirty water by harnessing evaporation and condensation.',
    materials: ['Dark bowl or basin', 'Small collection cup', 'Clear plastic wrap', 'Small rock or weight'],
    steps: ['Place the collection cup in the center of the dark bowl', 'Pour the contaminated water into the bowl without filling the cup', 'Cover the bowl tightly with clear plastic wrap', 'Put a small rock in the center of the plastic so it forms a low point above the cup', 'Place in direct sunlight and wait for condensation to collect and drip into the cup']
  },
  'casein-plastic': {
    title: 'Casein Plastic',
    purpose: 'Convert milk protein (casein) into a plastic-like material',
    description: 'Turn milk into a biodegradable plastic by adding an acid to separate casein proteins. Press and dry the curds to make a hard, moldable material suitable for simple crafts.',
    materials: ['Milk', 'Vinegar (acid)', 'Saucepan', 'Strainer', 'Mold or cookie cutter'],
    steps: ['Heat the milk gently (do not boil)', 'Add vinegar slowly and stir until curds form', 'Strain the curds through a cloth or strainer', 'Press the curds into a mold and allow to dry into a hard shape']
  },
  'zeer-pot': {
    title: 'Zeer Pot (Evaporative Cooler)',
    purpose: 'Teach evaporative cooling for food preservation',
    description: 'A non-electric cooler made from two terracotta pots and wet sand. Evaporation from the sand cools the inner pot, helping preserve food and keep items cool.',
    materials: ['Two unglazed terracotta pots (one smaller)', 'Sand', 'Water', 'Wet cloth or burlap'],
    steps: ['Place the smaller pot inside the larger one', 'Fill the gap with wet sand', 'Cover the top with a wet cloth and keep the sand moist', 'Place in a ventilated, shaded area']
  },
  'water-rocket': {
    title: 'Water Bottle Rocket',
    purpose: 'Demonstrate Newton\'s action–reaction principle with a water bottle rocket',
    description: 'Launch a rocket using pressurized air and water. This hands-on activity demonstrates Newton\'s Third Law by propelling the bottle upward as water is forced out.',
    materials: ['Plastic soda bottle (PET)', 'Cardboard for fins', 'Cork or rubber stopper', 'Bicycle pump with needle adapter'],
    steps: ['Build stable fins and attach to the bottle', 'Partially fill the bottle with water', 'Seal the bottle with a cork/stopper and pressurize using the pump', 'Release safely and observe the launch']
  },
  'herb-bug-spray': {
    title: 'Herb Bug Spray',
    purpose: 'Make a natural insect-repellent spray from aromatic herbs',
    description: 'Extract essential oils from pungent herbs (like lemongrass or mint) using alcohol or hot water to make a safe, natural insect repellent.',
    materials: ['Fresh herbs (lemongrass, mint, basil)', 'Rubbing alcohol or vodka', 'Hot water', 'Spray bottle'],
    steps: ['Chop or bruise the herbs and steep them in alcohol or hot water', 'Strain the liquid and mix with a small amount of carrier (water or alcohol)', 'Pour into a spray bottle and test on a small skin area before use']
  },
  'sundial': {
    title: 'Sundial',
    purpose: 'Make a sundial to tell time using the Sun\'s shadow',
    description: 'Construct a simple sundial using a gnomon (stick) and a marked base to track the sun\'s position and estimate the hour of the day.',
    materials: ['Straight stick or pencil', 'Modeling clay', 'Paper plate or cardboard', 'Markers or small stones'],
    steps: ['Fix the stick (gnomon) vertically in the center of the base', 'At known times, mark the tip of the shadow on the base', 'Label marks to form hour indicators']
  },
  'periscope': {
    title: 'Periscope',
    purpose: 'Use mirrors to see over obstacles and demonstrate reflection',
    description: 'Build a periscope using two mirrors placed at 45° angles so you can see over or around barriers.',
    materials: ['Long cardboard box', 'Two small flat mirrors', 'Tape', 'Utility knife'],
    steps: ['Cut viewing holes at both ends of the box', 'Mount mirrors at 45° so they face each other', 'Seal edges and test alignment']
  },
  'lemon-battery': {
    title: 'Lemon Battery',
    purpose: 'Generate electricity from an electrochemical fruit cell',
    description: 'Use a lemon as an electrolyte and two dissimilar metals to create a small battery capable of powering an LED.',
    materials: ['Lemon', 'Copper coin or wire', 'Zinc-plated nail', 'LED', 'Wires'],
    steps: ['Insert the copper and zinc metals into the lemon without touching', 'Connect wires from each metal to the LED', 'Combine multiple lemons in series for higher voltage']
  },
  'cartesian-diver': {
    title: 'Cartesian Diver',
    purpose: 'Demonstrate pressure transmission and buoyancy using a sealed bottle',
    description: 'Make a Cartesian diver that sinks and floats when you squeeze a sealed bottle, illustrating Pascal\'s law and density principles.',
    materials: ['Clear plastic bottle', 'Eyedropper or small pipette', 'Water'],
    steps: ['Fill the bottle with water and place the diver inside', 'Seal the bottle and squeeze to change internal pressure and observe the diver sink or float']
  },
  'balloon-hovercraft': {
    title: 'Balloon Hovercraft',
    purpose: 'Create a low-friction hover platform using escaping air',
    description: 'Glue a balloon to a CD (or similar platform) with a sport-cap valve so that inflated air creates an air cushion allowing the platform to glide.',
    materials: ['Old CD/DVD', 'Balloon', 'Sport cap (push-pull) or bottle cap', 'Glue'],
    steps: ['Attach the sport cap over the CD hole', 'Glue the deflated balloon around the cap and inflate', 'Release air to create a cushion and glide across a smooth surface']
  },
  'paper-bridge': {
    title: 'Paper Bridge Challenge',
    purpose: 'Explore structural strength by building a bridge from a sheet of paper',
    description: 'Fold and shape paper to create structural forms that dramatically increase strength and load-bearing capacity.',
    materials: ['A4 paper sheet', 'Weights for testing', 'Two supports (books)'],
    steps: ['Fold the paper into beams or trusses', 'Span between supports and test with weights', 'Iterate designs to improve load capacity']
  },
  'magic-milk': {
    title: 'Magic Milk',
    purpose: 'Demonstrate surface tension using milk and dish soap',
    description: 'Food coloring forms swirling patterns on milk when dish soap is added, illustrating how soap breaks surface tension and interacts with fats.',
    materials: ['Whole milk', 'Shallow plate', 'Food coloring', 'Dish soap', 'Cotton swab'],
    steps: ['Pour milk into a shallow plate', 'Add drops of food coloring', 'Dip a detergent-soaked cotton swab into the center and watch colors swirl']
  },
  'rock-candy': {
    title: 'Rock Candy',
    purpose: 'Grow edible sugar crystals using supersaturated solutions',
    description: 'Create a supersaturated sugar solution and grow large sugar crystals on a stick or string over several days.',
    materials: ['Sugar', 'Hot water', 'Glass jar', 'Wooden skewer', 'Clothespin'],
    steps: ['Dissolve a large amount of sugar in hot water to create a supersaturated solution', 'Suspend a skewer in the solution and allow crystals to form as it cools']
  },
  'string-telephone': {
    title: 'String Telephone',
    purpose: 'Send sound vibrations across a taut string',
    description: 'Use two cans and a taut string to transmit voice vibrations through the string, demonstrating how sound can travel via solids.',
    materials: ['Two empty cans', 'Long string', 'Nail or sharp tool'],
    steps: ['Make a hole in the bottom of each can', 'Tie string to each can and pull taut', 'Speak into one can while the other listener holds the other can']
  },
  // Add explicit English overrides for high-priority entries so the UI shows English copy immediately.
  'volcano': {
    title: 'Model Volcano',
    purpose: 'Demonstrate an acid–base chemical reaction and gas production.',
    description: 'Create an erupting volcano model using baking soda and vinegar to demonstrate CO₂ production and bubbling foam. This hands-on activity shows how an acid and a base react to release gas and produce an eruption-like effect.',
    sciencePrinciple: 'When an acid (vinegar) reacts with a base (baking soda), carbon dioxide gas (CO₂) is produced. The reaction releases gas bubbles that expand the mixture and push it out of the model volcano: NaHCO₃ + CH₃COOH → CO₂ + H₂O + CH₃COONa.',
    funFacts: ['Real volcanoes erupt from molten rock called magma, not chemical reactions.', 'Food coloring and dish soap help the eruption look like lava by increasing foam and color.'],
    materials: ['Baking soda', 'Vinegar', 'Food coloring', 'Dish soap'],
    steps: ['Prepare the volcano base', 'Add baking soda and coloring', 'Pour vinegar to trigger the eruption'],
    warnings: 'Do not ingest materials. Protect eyes and surfaces from splatter.'
  },
  'lava-lamp': {
    title: 'Homemade Lava Lamp',
    purpose: 'Explore density differences and immiscible liquids with a colorful display.',
    description: 'Make a decorative lava lamp using water and oil to observe how liquids with different densities and immiscibility interact to form rising and sinking blobs of color.',
    sciencePrinciple: 'Liquids with different densities (water vs oil) do not mix and will separate into layers. Adding a salt or effervescent tablet changes local density, causing colored droplets to sink or rise, producing a lava-like motion.',
    funFacts: ['The modern lava lamp was invented in 1963 and became a popular decorative item.', 'Shining a light from below enhances the visual effect by making the blobs glow.'],
    materials: ['Water', 'Vegetable oil', 'Food coloring', 'Salt', 'Dish soap'],
    steps: ['Pour water and oil into a clear container', 'Add food coloring (it will sink into the water)', 'Add salt or effervescent tablet to create motion and observe the blobs'],
    warnings: 'Keep away from small children and do not ingest.'
  },
  'bridge': {
    title: 'Popsicle Stick Bridge',
    purpose: 'Teach structural design and load distribution using simple materials.',
    description: 'Design and build a bridge from popsicle sticks and glue, then test how much weight it can support while learning about trusses and force distribution.',
    sciencePrinciple: 'Structural strength comes from geometry: triangulation and truss patterns distribute loads and reduce bending. Using triangular elements helps transfer forces through the structure to supports.',
    funFacts: ['Triangular truss designs are common in real-world bridges for efficient load distribution.', 'Well-built popsicle-stick bridges can support surprisingly large weights relative to their size.'],
    materials: ['Popsicle sticks', 'White glue', 'String (optional)'],
    steps: ['Design the bridge geometry', 'Construct the bridge using glued joints', 'Test the bridge with incremental weights'],
    warnings: 'Use cutting tools and glue with supervision.'
  },
  'seismograph': {
    title: 'Simple Seismograph',
    purpose: 'Record ground vibrations using a suspended mass and pen.',
    description: 'Build a basic seismograph where a suspended weight holds a pen that traces motion on paper, demonstrating how ground vibrations are recorded.',
    sciencePrinciple: 'A suspended mass tends to remain stationary (inertia) while the frame moves during ground vibrations. The relative motion between the mass and frame is recorded as pen traces on moving paper, revealing vibration patterns.',
    funFacts: ['Early seismographs used mechanical pens and smoked paper to record vibrations.', 'Modern instruments digitize motion and can detect very small ground movements from earthquakes or passing vehicles.'],
    materials: ['Cardboard box', 'Weight (nut or small rock)', 'String', 'Pen', 'Roll of paper'],
    steps: ['Build a stable frame', 'Suspend the weight with a pen attached so it writes on moving paper', 'Simulate vibrations and observe the trace'],
    warnings: 'Securely fasten components to avoid collapse.'
  },
  'automated-greenhouse': {
    title: 'Automated Mini-Greenhouse',
    purpose: 'Automate watering and lighting with sensors and a microcontroller.',
    description: 'Assemble a mini greenhouse that waters plants and provides supplemental light automatically using an Arduino (or similar) and sensors for soil moisture and light level.',
    sciencePrinciple: 'Feedback control systems use sensor input (soil moisture, light) to make decisions and actuate devices (pumps, lights). Threshold-based automation turns actuators on or off to maintain desired conditions for plant growth.',
    funFacts: ['Smart farming and small-scale automation can significantly reduce water use and improve yields.', 'Common sensors include soil moisture probes and light-dependent resistors (LDRs) to measure ambient light.'],
    materials: ['Microcontroller (Arduino)', 'Soil moisture sensor', 'Light sensor (LDR)', 'Small water pump', 'Relay module', 'LED grow light', 'Plastic container or small greenhouse box'],
    steps: ['Assemble the greenhouse structure', 'Install sensors and actuators', 'Wire components to the microcontroller and program control logic', 'Test and tune thresholds'],
    warnings: 'Follow safe wiring practices; keep electronics away from water.'
  },
  'weather-station': {
    title: 'Analog Weather Station',
    purpose: 'Measure wind speed, wind direction and rainfall using simple mechanical instruments.',
    description: 'Build an analog weather station with an anemometer, wind vane and rain gauge from household materials to measure basic local weather parameters.',
    sciencePrinciple: 'Anemometers measure wind speed by counting rotations of cups or cups-per-time; a wind vane aligns with wind direction due to differential pressure; a rain gauge collects precipitation in a calibrated container to measure rainfall volume.',
    funFacts: ['The first organized weather observations date back centuries; simple instruments remain useful teaching tools.', 'Anemometers were described in the 15th century and have evolved into precise electronic sensors.'],
    materials: ['Plastic bottles', 'Ping-pong balls', 'Straws', 'Dowels', 'Clear cylinder or jar'],
    steps: ['Construct an anemometer with cups or ping-pong halves', 'Build a wind vane with cardboard and a pivot', 'Make a rain gauge and calibrate with markings'],
    warnings: 'Install in an open area away from obstructions for accurate readings.'
  }
}

for (const [id, fields] of Object.entries(MANUAL_EN)) {
  const idx = result.findIndex(r => r.id === id)
  if (idx >= 0) {
    result[idx] = { ...result[idx], ...fields }
  } else {
    // Defensive: add a minimal entry if the canonical dataset lacks this id
    result.push({ id, title: fields.title || id, purpose: fields.purpose || '', description: fields.description || '', materials: fields.materials || [], steps: fields.steps || [] } as Blueprint)
  }
}

const exported: Blueprint[] = result

export default exported
