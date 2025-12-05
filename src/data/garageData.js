/**
 * Car data for the My Garage page
 *
 * Fill in your car details below. Each car has:
 * - id: Unique identifier
 * - title: Car name (e.g., "2019 Ford Mustang GT")
 * - image: Path to thumbnail image (place images in /public/images/garage/)
 * - briefInfo: Short 1-2 sentence summary for the card
 * - description: Full paragraph for the detail view
 * - stats: Performance specifications + usage/status info
 * - mods: List of modifications (grouped by category)
 */

export const cars = [
  {
    id: "M3TH",
    title: "2023 Mazda 3 Turbo Hatchback",
    image: "/images/garage/M3TH.jpeg",
    briefInfo: "Hot hatch adjacent, dream daily for many years. Now mine. \n\n An absolute treat at the AutoX, and getting it ready for more track days.",
    description: "My current daily driver. I purchased this car used in 2025 after another driver totalled my beloved 2015 Mazda 3. Slowly building it up for spirited driving plus autocross duties, but it will see a track day every now and then.\n\n Next up on the todo list is a tune, coilovers, and Brembo big brake kit. Eventually...",
    stats: {
      power: "250 HP",
      torque: "320 lb-ft",
      zeroToSixty: "5.5s",
      forzaClass: "B 620",
      topSpeed: "135 mph",
      drivetrain: "AWD",
      transmission: "Auto",
      status: "Owned",
      usage: ["Daily", "AutoX", "Track"]
    },
    mods: [
      { name: "Corksport Short Ram Intake + Heatshield", category: "Engine" },
      { name: "Corksport Turbo Inlet Pipe", category: "Engine" },
      { name: "Corksport Rear Sway Bar", category: "Suspension" },
      { name: "Michelin Pilot Sport 4", category: "Wheels + Tires" },
      { name: "Konig Ultragrams 18x8.5", category: "Wheels + Tires" },
      { name: "EBC Redstuff Brake Pads", category: "Brakes" },
      { name: "Powerstop Drilled and Slotted Rotors", category: "Brakes" },
      { name: "Motul RBF 600 Brake Fluid", category: "Brakes" },
      { name: "Wireless Carplay Adapter", category: "Electronics" },
      { name: "Radar Detector and Hardwiring Kit", category: "Electronics" },
      { name: "ScanGauge III and 3D Printed Mount", category: "Electronics" },
      { name: "FitcamX Dashcam", category: "Electronics" },
    ]
  },
  {
    id: "BERG",
    title: "1988 Pontiac Firebird",
    image: "/images/garage/BERG.jpeg",
    briefInfo: "Group project car! 1969 Chevy 307 engine swap. \n T-Tops and a V8 make for a great time.",
    description: "Split the cost between 4 friends, project never ends. T-Tops are fantastic, V8 sounds like a tractor. What more could you want in a $3000 car? \n\n Breaks down with some regularity, but always a cheap fix. Very fun to slide in the rain.",
    stats: {
      power: "200 HP",
      torque: "300 lb-ft",
      zeroToSixty: "7.8s",
      forzaClass: "D 194",
      topSpeed: "??? mph",
      drivetrain: "RWD",
      transmission: "Manual",
      status: "Owned",
      usage: ["Project", "AutoX"]
    },
    mods: [
      { name: "1969 Chevy 307 Engine", category: "Engine" },
      { name: "2 Sets of Rear Wheels", category: "Wheels + Tires" },
    ]
  },
  {
    id: "Z4M",
    title: "2007 BMW Z4 M Coupe",
    image: "/images/garage/Z4M.jpeg",
    briefInfo: "Track car purchased for my dad and I, many mods. \n 8000 RPM solves a lot of problems.",
    description: "8000 RPM, straight six, manual transmission. A dream at the track, fun everywhere else too. \n\n Not looking forward to dealing with the rod bearings.",
    stats: {
      power: "350 HP",
      torque: "260 lb-ft",
      zeroToSixty: "5.8s",
      forzaClass: "A 523",
      topSpeed: "160+ mph",
      drivetrain: "RWD",
      transmission: "Manual",
      status: "Owned",
      usage: ["Project", "AutoX", "Track"]
    },
    mods: [
      { name: "Exhaust", category: "Engine" },
      { name: "Tune", category: "Engine" },
      { name: "Coilovers", category: "Suspension" },
      { name: "Continental Extreme Contact Tires", category: "Wheels + Tires" },
      { name: "BBS Wheels", category: "Wheels + Tires" },
      { name: "StopTech Big Brake Kit", category: "Brakes" },
      { name: "Wireless Carplay Kit", category: "Electronics" },
    ]
  },
  {
    id: "M3",
    title: "2015 Mazda 3 S Grand Touring",
    image: "/images/garage/M3.jpeg",
    briefInfo: "My first car, then my third car, then gone. \n Great fun, learned some software hacks.",
    description: "My mom's old car, learned to drive in it. Proceeded to buy the Audi A4, it sucked, and then returned to this car, which never let me down. \n I learned a lot of software hacks in this car, getting it set up with Mazda AIO Tweaks and CASDK, and then writing my own digital dashboard app. \n In January 2023, another driver totalled the car, leading to my new Mazda 3 Turbo. Loved this car, quite fun to drive, and quicker than one would expect at the AutoX. \n Read more about what I've done to it here: https://blog.romangarms.com/2024/06/hacking-my-mazda-infotainment-mzd-aio.html https://blog.romangarms.com/2024/03/drtuned-tuning-my-car-with-my-steam-deck.html",
    stats: {
      power: "200 HP",
      torque: "190 lb-ft",
      zeroToSixty: "7.2s",
      forzaClass: "D 254",
      topSpeed: "129 mph",
      drivetrain: "FWD",
      transmission: "Auto",
      status: "Sold",
      usage: ["Daily", "AutoX"]
    },
    mods: [
      { name: "Corksport Short Ram Intake + Heatshield", category: "Engine" },
      { name: "DrTuned Tier 1 Tune", category: "Engine" },
      { name: "Progress Rear Sway Bar", category: "Suspension" },
      { name: "Michelin Pilot Sport 4", category: "Wheels + Tires" },
      { name: "Mazda CX5 Wheels", category: "Wheels + Tires" },
      { name: "EBC Redstuff Brake Pads", category: "Brakes" },
      { name: "EBC Brake Rotors", category: "Brakes" },
      { name: "DOT 4 Brake Fluid", category: "Brakes" },
      { name: "Wireless Carplay Adapter", category: "Electronics" },
      { name: "Radar Detector and Hardwiring Kit", category: "Electronics" },
      { name: "CASDK and Mazda AIO Tweaks Jailbreak", category: "Electronics" },
    ]
  },
  {
    id: "A4",
    title: "2011 Audi A4",
    image: "/images/garage/A4.jpeg",
    briefInfo: "Mechanical nightmare, fun to drive. Owned for less than a year. \n 200 miles to the quart (of oil).",
    description: "Bought in late 2022, sold in mid 2023. First car that was my own, learned to drive manual in it. Most things were lovely, but burning a quart of oil every 200 miles is unacceptable. \n\n I miss this car in theory, but in reality it's probably good that it's gone. \n Read about some of the mods I did here: https://blog.romangarms.com/2023/01/installing-carplay-in-11-year-old-audi.html",
    stats: {
      power: "250 HP",
      torque: "270 lb-ft",
      zeroToSixty: "6.0s",
      forzaClass: "D 338",
      topSpeed: "155 mph",
      drivetrain: "AWD",
      transmission: "Manual",
      status: "Sold",
      usage: ["Daily", "AutoX", "Track"]
    },
    mods: [
      { name: "Tune", category: "Engine" },
      { name: "Continental Extreme Contact Sports", category: "Wheels + Tires" },
      { name: "VMR Wheels", category: "Wheels + Tires" },
      { name: "Drilled and Slotted Rotors", category: "Brakes" },
      { name: "Wireless Carplay Kit", category: "Electronics" },
    ]
  }
];
