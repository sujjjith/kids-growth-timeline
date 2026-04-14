/*
 * IMPORTANT: Before adding seed data to this file, read ./seed.ts.example to see an example seed data definition
 * If you are an LLM or agent, you MUST follow this above rule.
 */
import { FauxFoundry } from "@osdk/faux";
import {
  kidProfile,
  educationRecord,
  kidActivity,
  kidCompetition,
  summerCamp,
  vacationTrip,
  growthMeasurement,
  timelineEvent,
} from "../.osdk/src";
import { randomUUID } from "node:crypto";

const DEFAULT_ONTOLOGY_RID = "ri.ontology.main.ontology.00000000-0000-0000-0000-000000000000";
const DEFAULT_REALM = "realm";
const DEFAULT_ORG_RID = "ri.multipass..organization.00000000-0000-0000-0000-000000000000";

export const seed = (fauxFoundry: FauxFoundry) => {
  const dataStore = fauxFoundry.getDataStore(DEFAULT_ONTOLOGY_RID);

  // ============================================================
  // PARENT USER
  // ============================================================
  const parentUserId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
  fauxFoundry.admin.registerUser({
    id: parentUserId,
    username: "parent",
    givenName: "Parent",
    familyName: "User",
    email: "parent@family.com",
    status: "ACTIVE",
    realm: DEFAULT_REALM,
    organization: DEFAULT_ORG_RID,
    attributes: {},
  });
  fauxFoundry.admin.setCurrentUser(parentUserId);

  // ============================================================
  // STABLE IDs — used to cross-reference kids in all records
  // ============================================================
  const NIREK_ID = "kid-nirek-001";
  const MISHKA_ID = "kid-mishka-002";

  // ============================================================
  // KID PROFILES
  // ============================================================
  dataStore.registerObject(kidProfile, {
    kidId: NIREK_ID,
    firstName: "Nirek",
    lastName: "Shah",
    dateOfBirth: "2020-07-09",
    gender: "Male",
    nickname: "Niri",
    notes:
      "Energetic and curious boy who loves dinosaurs, trucks, and outdoor play. Starting kindergarten in Fall 2025.",
  });

  dataStore.registerObject(kidProfile, {
    kidId: MISHKA_ID,
    firstName: "Mishka",
    lastName: "Shah",
    dateOfBirth: "2017-04-09",
    gender: "Female",
    nickname: "Mishi",
    notes: "Creative and bright girl who loves reading, art, and science experiments. Entering 4th grade in Fall 2025.",
  });

  // ============================================================
  // EDUCATION RECORDS — Mishka
  // ============================================================
  const eduMishkaPreschool = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduMishkaPreschool,
    kidId: MISHKA_ID,
    schoolName: "Little Stars Preschool",
    grade: "Preschool",
    startDate: "2020-09-08",
    endDate: "2021-06-15",
    achievement: "Completed pre-reading readiness program",
    description: "First year of structured learning with focus on social skills, letters, and numbers.",
    category: "Early Childhood",
  });

  const eduMishkaKinder = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduMishkaKinder,
    kidId: MISHKA_ID,
    schoolName: "Maplewood Elementary",
    grade: "Kindergarten",
    startDate: "2021-08-23",
    endDate: "2022-06-10",
    achievement: "Star Reader Award",
    description: "Learned to read independently by mid-year. Loved circle time and show-and-tell.",
    category: "Elementary",
  });

  const eduMishka1st = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduMishka1st,
    kidId: MISHKA_ID,
    schoolName: "Maplewood Elementary",
    grade: "1st Grade",
    startDate: "2022-08-22",
    endDate: "2023-06-09",
    achievement: "Honor Roll — All A's",
    description: "Excelled in reading and math. Started learning cursive writing and basic multiplication.",
    category: "Elementary",
  });

  const eduMishka2nd = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduMishka2nd,
    kidId: MISHKA_ID,
    schoolName: "Maplewood Elementary",
    grade: "2nd Grade",
    startDate: "2023-08-21",
    endDate: "2024-06-07",
    achievement: "Science Fair Participant, Perfect Attendance",
    description: "Developed strong interest in science. Completed first independent book report on Charlotte's Web.",
    category: "Elementary",
  });

  const eduMishka3rd = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduMishka3rd,
    kidId: MISHKA_ID,
    schoolName: "Maplewood Elementary",
    grade: "3rd Grade",
    startDate: "2024-08-19",
    endDate: "2025-06-06",
    achievement: "Spelling Bee Champion, Math Olympiad Qualifier",
    description:
      "Thrived in all subjects. Joined the school coding club and developed leadership skills as class helper.",
    category: "Elementary",
  });

  const eduMishka4th = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduMishka4th,
    kidId: MISHKA_ID,
    schoolName: "Maplewood Elementary",
    grade: "4th Grade",
    startDate: "2025-08-18",
    endDate: undefined,
    achievement: undefined,
    description: "Starting 4th grade! Looking forward to the annual science fair and joining student council.",
    category: "Elementary",
  });

  // ============================================================
  // EDUCATION RECORDS — Nirek
  // ============================================================
  const eduNirekPreschool = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduNirekPreschool,
    kidId: NIREK_ID,
    schoolName: "Sunshine Montessori",
    grade: "Preschool",
    startDate: "2023-09-05",
    endDate: "2024-06-14",
    achievement: "Learned to write his name and count to 50",
    description: "First school experience. Loved the sandbox, building blocks, and dinosaur books.",
    category: "Early Childhood",
  });

  const eduNirekPreK = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduNirekPreK,
    kidId: NIREK_ID,
    schoolName: "Sunshine Montessori",
    grade: "Pre-K",
    startDate: "2024-09-03",
    endDate: "2025-06-13",
    achievement: "Pre-reading readiness, Basic addition and subtraction",
    description: "Grew more independent. Started recognizing sight words and developed fine motor skills for writing.",
    category: "Early Childhood",
  });

  const eduNirekKinder = randomUUID();
  dataStore.registerObject(educationRecord, {
    educationId: eduNirekKinder,
    kidId: NIREK_ID,
    schoolName: "Maplewood Elementary",
    grade: "Kindergarten",
    startDate: "2025-08-18",
    endDate: undefined,
    achievement: undefined,
    description:
      "Starting kindergarten at the same school as big sister Mishka! Very excited about the playground and making new friends.",
    category: "Elementary",
  });

  // ============================================================
  // ACTIVITIES — Mishka
  // ============================================================
  const actMishkaSwim = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actMishkaSwim,
    kidId: MISHKA_ID,
    activityName: "Swimming Lessons",
    activityType: "Sports",
    provider: "Aqua Kids Swim School",
    startDate: "2021-06-01",
    endDate: "2025-08-31",
    dayOfWeek: "Saturday",
    description:
      "Progressed from beginner to advanced swimmer. Can do butterfly, backstroke, freestyle, and breaststroke. Completed Level 6 certification.",
  });

  const actMishkaPiano = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actMishkaPiano,
    kidId: MISHKA_ID,
    activityName: "Piano Classes",
    activityType: "Music",
    provider: "Mrs. Chen's Music Studio",
    startDate: "2022-09-10",
    endDate: undefined,
    dayOfWeek: "Wednesday",
    description:
      "Started with basics, now playing intermediate pieces. Performed in two annual recitals. Currently working on Fur Elise.",
  });

  const actMishkaArt = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actMishkaArt,
    kidId: MISHKA_ID,
    activityName: "Art Class",
    activityType: "Creative Arts",
    provider: "Creative Minds Studio",
    startDate: "2023-01-15",
    endDate: "2024-12-15",
    dayOfWeek: "Tuesday",
    description:
      "Explored watercolors, acrylics, clay sculpture, and mixed media. Created a portfolio of 20+ original works.",
  });

  const actMishkaCoding = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actMishkaCoding,
    kidId: MISHKA_ID,
    activityName: "Coding Club",
    activityType: "Technology",
    provider: "Maplewood Elementary — After School Program",
    startDate: "2024-09-15",
    endDate: undefined,
    dayOfWeek: "Thursday",
    description:
      "Learning Scratch programming and basic web development. Built a simple animated story and a quiz game.",
  });

  const actMishkaDance = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actMishkaDance,
    kidId: MISHKA_ID,
    activityName: "Dance Classes",
    activityType: "Performing Arts",
    provider: "Grace Dance Academy",
    startDate: "2023-09-05",
    endDate: undefined,
    dayOfWeek: "Friday",
    description:
      "Started with ballet, now also learning contemporary dance. Performed in the spring showcase two years running.",
  });

  // ============================================================
  // ACTIVITIES — Nirek
  // ============================================================
  const actNirekSoccer = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actNirekSoccer,
    kidId: NIREK_ID,
    activityName: "Soccer",
    activityType: "Sports",
    provider: "Little Kickers Youth League",
    startDate: "2024-03-01",
    endDate: undefined,
    dayOfWeek: "Saturday",
    description:
      "Plays on the Blue Lightning team. Loves being goalie and has great coordination for his age. Spring and fall seasons.",
  });

  const actNirekSwim = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actNirekSwim,
    kidId: NIREK_ID,
    activityName: "Swimming Lessons",
    activityType: "Sports",
    provider: "Aqua Kids Swim School",
    startDate: "2023-06-01",
    endDate: undefined,
    dayOfWeek: "Saturday",
    description:
      "Goes with sister Mishka. Completed Level 3 — can swim independently in the shallow end. Working on freestyle technique.",
  });

  const actNirekDrawing = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actNirekDrawing,
    kidId: NIREK_ID,
    activityName: "Drawing Class",
    activityType: "Creative Arts",
    provider: "Creative Minds Studio",
    startDate: "2024-09-10",
    endDate: undefined,
    dayOfWeek: "Monday",
    description:
      "Loves drawing dinosaurs, superheroes, and trucks. Learning basic shapes, coloring techniques, and simple perspective.",
  });

  const actNirekKarate = randomUUID();
  dataStore.registerObject(kidActivity, {
    activityId: actNirekKarate,
    kidId: NIREK_ID,
    activityName: "Karate",
    activityType: "Martial Arts",
    provider: "Tiger Martial Arts Academy",
    startDate: "2025-01-15",
    endDate: undefined,
    dayOfWeek: "Wednesday",
    description:
      "Just started! White belt working toward yellow. Loves the discipline and the cool moves. Great for building focus and confidence.",
  });

  // ============================================================
  // COMPETITIONS — Mishka
  // ============================================================
  const compMishkaSpelling = randomUUID();
  dataStore.registerObject(kidCompetition, {
    competitionId: compMishkaSpelling,
    kidId: MISHKA_ID,
    competitionName: "Maplewood Elementary Spelling Bee",
    competitionType: "Academic",
    eventDate: "2025-02-14",
    result: "1st Place — School Champion",
    placement: "1st",
    description:
      "Won the school-level spelling bee! Correctly spelled 'magnificent' in the final round. Qualified for the district competition.",
  });

  const compMishkaScience = randomUUID();
  dataStore.registerObject(kidCompetition, {
    competitionId: compMishkaScience,
    kidId: MISHKA_ID,
    competitionName: "Annual Science Fair",
    competitionType: "Science",
    eventDate: "2024-04-20",
    result: "2nd Place — Blue Ribbon",
    placement: "2nd",
    description:
      "Project: 'Do Plants Grow Better with Music?' Tested plant growth under different music genres over 6 weeks. Judges loved the detailed data charts.",
  });

  const compMishkaArt = randomUUID();
  dataStore.registerObject(kidCompetition, {
    competitionId: compMishkaArt,
    kidId: MISHKA_ID,
    competitionName: "Young Artists Showcase",
    competitionType: "Art",
    eventDate: "2024-11-10",
    result: "Honorable Mention",
    placement: "Top 10",
    description:
      "Submitted a watercolor painting titled 'Sunset Over the Mountains.' Selected for display in the community art center for one month.",
  });

  const compMishkaMath = randomUUID();
  dataStore.registerObject(kidCompetition, {
    competitionId: compMishkaMath,
    kidId: MISHKA_ID,
    competitionName: "Regional Math Olympiad",
    competitionType: "Academic",
    eventDate: "2025-03-22",
    result: "Bronze Medal",
    placement: "3rd",
    description:
      "Competed against 3rd-5th graders from 12 schools. Excelled in problem-solving and pattern recognition sections.",
  });

  // ============================================================
  // COMPETITIONS — Nirek
  // ============================================================
  const compNirekSoccer = randomUUID();
  dataStore.registerObject(kidCompetition, {
    competitionId: compNirekSoccer,
    kidId: NIREK_ID,
    competitionName: "Little Kickers Fall Tournament",
    competitionType: "Sports",
    eventDate: "2024-10-19",
    result: "Team Trophy — 2nd Place",
    placement: "2nd",
    description:
      "Blue Lightning team made it to the finals! Nirek made 3 amazing saves as goalie. Received the 'Best Sportsmanship' individual award.",
  });

  const compNirekArt = randomUUID();
  dataStore.registerObject(kidCompetition, {
    competitionId: compNirekArt,
    kidId: NIREK_ID,
    competitionName: "Sunshine Montessori Art Contest",
    competitionType: "Art",
    eventDate: "2024-05-15",
    result: "Winner — Most Creative",
    placement: "1st",
    description:
      "Drew an incredible dinosaur scene with a volcano erupting in the background. Teachers loved the imagination and color choices.",
  });

  // ============================================================
  // SUMMER CAMPS — Mishka
  // ============================================================
  const campMishkaStem = randomUUID();
  dataStore.registerObject(summerCamp, {
    campId: campMishkaStem,
    kidId: MISHKA_ID,
    campName: "Camp Invention — STEM Explorer",
    campType: "STEM",
    location: "Maplewood Community Center",
    startDate: "2023-06-19",
    endDate: "2023-06-30",
    highlights: "Built a working catapult, coded a simple robot, and designed a solar oven that melted s'mores",
    description:
      "Week-long STEM camp focused on invention, engineering challenges, and hands-on experiments. Mishka's favorite was the robotics module.",
  });

  const campMishkaArt = randomUUID();
  dataStore.registerObject(summerCamp, {
    campId: campMishkaArt,
    kidId: MISHKA_ID,
    campName: "Creative Arts Summer Intensive",
    campType: "Art",
    location: "Creative Minds Studio",
    startDate: "2024-07-08",
    endDate: "2024-07-26",
    highlights: "Created a mural, learned pottery on a wheel, and made a stop-motion animation short film",
    description:
      "Three-week immersive art camp covering painting, sculpture, digital art, and animation. Culminated in a gallery show for parents.",
  });

  const campMishkaNature = randomUUID();
  dataStore.registerObject(summerCamp, {
    campId: campMishkaNature,
    kidId: MISHKA_ID,
    campName: "Nature Explorers Outdoor Camp",
    campType: "Outdoor/Nature",
    location: "Green Valley Nature Reserve",
    startDate: "2025-06-16",
    endDate: "2025-07-03",
    highlights: "Hiking, wildlife tracking, campfire cooking, and overnight camping under the stars",
    description:
      "Two-week outdoor adventure camp focusing on ecology, survival skills, and nature appreciation. Includes a two-night camping trip.",
  });

  // ============================================================
  // SUMMER CAMPS — Nirek
  // ============================================================
  const campNirekMini = randomUUID();
  dataStore.registerObject(summerCamp, {
    campId: campNirekMini,
    kidId: NIREK_ID,
    campName: "Little Explorers Mini Camp",
    campType: "General/Play",
    location: "Sunshine Montessori",
    startDate: "2024-06-17",
    endDate: "2024-06-28",
    highlights: "Water play day, dinosaur dig excavation, finger painting masterpieces, and a teddy bear picnic",
    description:
      "Two-week half-day camp designed for 3-4 year olds. Focus on sensory play, outdoor activities, and social skill building.",
  });

  const campNirekSports = randomUUID();
  dataStore.registerObject(summerCamp, {
    campId: campNirekSports,
    kidId: NIREK_ID,
    campName: "All-Stars Sports Camp",
    campType: "Sports",
    location: "Riverside Recreation Center",
    startDate: "2025-06-23",
    endDate: "2025-07-11",
    highlights: "Tried basketball, baseball, tennis, and obstacle courses. Won the relay race on the last day!",
    description:
      "Multi-sport camp introducing kids ages 4-6 to various sports. Focus on fun, teamwork, and fundamental movement skills.",
  });

  // ============================================================
  // VACATION TRIPS — Family trips use kidId "family" and tripType "Family"
  // ============================================================
  // Disney World 2022 — Family trip
  const tripDisney = randomUUID();
  dataStore.registerObject(vacationTrip, {
    tripId: tripDisney,
    kidId: "family",
    tripType: "Family",
    tripName: "Disney World Magic",
    destination: "Walt Disney World, Orlando, FL",
    startDate: "2022-12-22",
    endDate: "2022-12-29",
    highlights:
      "Met Elsa and Moana, rode Space Mountain, watched fireworks at Magic Kingdom every night, Buzz Lightyear ride, hotel pool fun",
    description:
      "Holiday family trip to Walt Disney World. Visited all four parks over a week. Mishka loved EPCOT and Frozen; Nirek (2.5) enjoyed characters, the pool, and snacks!",
  });

  // Grand Canyon 2023 — Family trip
  const tripCanyon = randomUUID();
  dataStore.registerObject(vacationTrip, {
    tripId: tripCanyon,
    kidId: "family",
    tripType: "Family",
    tripName: "Grand Canyon Adventure",
    destination: "Grand Canyon National Park, AZ",
    startDate: "2023-06-10",
    endDate: "2023-06-16",
    highlights:
      "Hiked Bright Angel Trail (partial), saw a condor, earned Junior Ranger badge, stargazing program, elk sightings",
    description:
      "Week-long family trip to the Grand Canyon. Stayed at the South Rim lodge. Mishka loved geology lessons; Nirek (almost 3) was fascinated by the canyon and wildlife.",
  });

  // Beach Vacation 2024 — Family trip
  const tripBeach = randomUUID();
  dataStore.registerObject(vacationTrip, {
    tripId: tripBeach,
    kidId: "family",
    tripType: "Family",
    tripName: "Summer Beach Getaway",
    destination: "Outer Banks, North Carolina",
    startDate: "2024-07-04",
    endDate: "2024-07-11",
    highlights:
      "Boogie boarding, epic sandcastle, dolphins from the pier, Wright Brothers Memorial, shell collecting, ice cream every day",
    description:
      "Week at a beach house in the Outer Banks. Perfect mix of relaxation and exploration. Mishka read 3 books; Nirek (age 4) loved the ocean waves.",
  });

  // National Parks Road Trip 2025 — Family trip
  const tripParks = randomUUID();
  dataStore.registerObject(vacationTrip, {
    tripId: tripParks,
    kidId: "family",
    tripType: "Family",
    tripName: "National Parks Road Trip",
    destination: "Yellowstone & Grand Teton, WY",
    startDate: "2025-06-01",
    endDate: "2025-06-10",
    highlights:
      "Old Faithful eruption, saw a bear and her cubs, kayaked on Jenny Lake, Junior Ranger badges, bison up close",
    description:
      "Epic 10-day family road trip through Yellowstone and Grand Teton. Mishka kept a nature journal; Nirek (almost 5) was obsessed with bison and hot springs.",
  });

  // ============================================================
  // GROWTH MEASUREMENTS — Mishka (born 2017-04-09, girl)
  // Typical girl growth: birth ~19.5in/7.5lb → age 9 ~52in/62lb
  // ============================================================
  const mishkaGrowth = [
    { date: "2017-04-09", height: 19.5, weight: 7.5, notes: "Birth — healthy baby girl!" },
    { date: "2017-10-09", height: 25.5, weight: 15.8, notes: "6 months — sitting up, babbling, first tooth" },
    { date: "2018-04-09", height: 29.0, weight: 20.2, notes: "1 year — first steps! Walking along furniture" },
    { date: "2018-10-09", height: 31.5, weight: 23.0, notes: "18 months — walking confidently, first words" },
    { date: "2019-04-09", height: 33.5, weight: 26.5, notes: "2 years — running, talking in short sentences" },
    { date: "2019-10-09", height: 35.5, weight: 28.5, notes: "2.5 years — potty training started, loves books" },
    {
      date: "2020-04-09",
      height: 37.5,
      weight: 31.0,
      notes: "3 years — fully potty trained, knows ABCs and counts to 20",
    },
    { date: "2020-10-09", height: 39.0, weight: 33.0, notes: "3.5 years — started preschool, making friends" },
    { date: "2021-04-09", height: 40.5, weight: 35.5, notes: "4 years — writing letters, riding tricycle" },
    {
      date: "2021-10-09",
      height: 42.0,
      weight: 38.0,
      notes: "4.5 years — kindergarten, riding bike with training wheels",
    },
    { date: "2022-04-09", height: 43.5, weight: 40.0, notes: "5 years — reading simple books, lost first tooth!" },
    { date: "2022-10-09", height: 44.5, weight: 42.5, notes: "5.5 years — bike without training wheels!" },
    { date: "2023-04-09", height: 46.0, weight: 45.0, notes: "6 years — loves chapter books, growing tall" },
    { date: "2023-10-09", height: 47.5, weight: 48.0, notes: "6.5 years — 2nd grade, strong swimmer" },
    { date: "2024-04-09", height: 49.0, weight: 52.0, notes: "7 years — science fair star, growth spurt!" },
    { date: "2024-10-09", height: 50.5, weight: 55.0, notes: "7.5 years — 3rd grade, very active in all activities" },
    { date: "2025-04-09", height: 52.0, weight: 59.0, notes: "8 years — tall for her age, healthy and strong" },
  ];

  for (const m of mishkaGrowth) {
    dataStore.registerObject(growthMeasurement, {
      measurementId: randomUUID(),
      kidId: MISHKA_ID,
      measurementDate: m.date,
      heightInches: m.height,
      weightLbs: m.weight,
      notes: m.notes,
    });
  }

  // ============================================================
  // GROWTH MEASUREMENTS — Nirek (born 2020-07-09, boy)
  // Typical boy growth: birth ~20in/7.8lb → age 5.5 ~44in/44lb
  // ============================================================
  const nirekGrowth = [
    { date: "2020-07-09", height: 20.0, weight: 7.8, notes: "Birth — healthy baby boy!" },
    { date: "2021-01-09", height: 26.0, weight: 16.5, notes: "6 months — rolling over, laughing, grabbing everything" },
    { date: "2021-07-09", height: 30.0, weight: 21.5, notes: "1 year — pulling up to stand, first words (mama, dada)" },
    { date: "2022-01-09", height: 32.0, weight: 24.0, notes: "18 months — walking everywhere, into everything!" },
    { date: "2022-07-09", height: 34.5, weight: 27.5, notes: "2 years — running, climbing, dinosaur obsession begins" },
    { date: "2023-01-09", height: 36.0, weight: 29.5, notes: "2.5 years — talking in full sentences, loves trucks" },
    { date: "2023-07-09", height: 38.0, weight: 32.0, notes: "3 years — potty trained, started preschool prep" },
    {
      date: "2024-01-09",
      height: 39.5,
      weight: 34.0,
      notes: "3.5 years — first semester of preschool, loves playground",
    },
    { date: "2024-07-09", height: 41.0, weight: 36.5, notes: "4 years — writing name, counting to 30, very social" },
    { date: "2025-01-09", height: 42.5, weight: 39.0, notes: "4.5 years — Pre-K, started karate, growing fast" },
    {
      date: "2025-07-09",
      height: 44.0,
      weight: 42.0,
      notes: "5 years — ready for kindergarten, strong and coordinated",
    },
  ];

  for (const m of nirekGrowth) {
    dataStore.registerObject(growthMeasurement, {
      measurementId: randomUUID(),
      kidId: NIREK_ID,
      measurementDate: m.date,
      heightInches: m.height,
      weightLbs: m.weight,
      notes: m.notes,
    });
  }

  // ============================================================
  // TIMELINE EVENTS — Mishka
  // ============================================================
  const mishkaTimeline = [
    // Custom / Growth milestones
    {
      date: "2017-04-09",
      title: "Mishka is born!",
      category: "Custom",
      desc: "Welcome to the world, baby girl! Born at 7:42 AM, 19.5 inches and 7.5 lbs.",
    },
    {
      date: "2017-10-15",
      title: "First tooth!",
      category: "Growth",
      desc: "Bottom front tooth appeared — lots of drooling and chewing!",
    },
    {
      date: "2018-03-20",
      title: "First steps",
      category: "Growth",
      desc: "Took her first independent steps across the living room. So proud!",
    },
    {
      date: "2018-04-09",
      title: "Mishka turns 1!",
      category: "Custom",
      desc: "Smash cake party with family. She loved the frosting!",
    },
    {
      date: "2018-08-10",
      title: "First word: 'Mama'",
      category: "Growth",
      desc: "Started saying mama consistently and waving bye-bye.",
    },
    {
      date: "2019-04-09",
      title: "Mishka turns 2!",
      category: "Custom",
      desc: "Butterfly-themed birthday party at the park with friends.",
    },

    // Education
    {
      date: "2020-09-08",
      title: "First day of Preschool",
      category: "Education",
      desc: "Started at Little Stars Preschool. Was brave and didn't cry!",
      relatedId: eduMishkaPreschool,
    },
    {
      date: "2021-08-23",
      title: "Started Kindergarten",
      category: "Education",
      desc: "First day at Maplewood Elementary! Wore her favorite purple backpack.",
      relatedId: eduMishkaKinder,
    },
    {
      date: "2022-01-15",
      title: "Learned to read independently",
      category: "Education",
      desc: "Read her first chapter book (Junie B. Jones) all by herself!",
    },
    {
      date: "2022-05-20",
      title: "Star Reader Award",
      category: "Education",
      desc: "Won the Star Reader Award for reading the most books in kindergarten.",
    },
    {
      date: "2022-08-22",
      title: "Started 1st Grade",
      category: "Education",
      desc: "Excited to be a 'big kid' in 1st grade!",
      relatedId: eduMishka1st,
    },
    {
      date: "2023-06-09",
      title: "1st Grade Honor Roll",
      category: "Education",
      desc: "All A's in 1st grade — celebrated with ice cream!",
    },
    {
      date: "2023-08-21",
      title: "Started 2nd Grade",
      category: "Education",
      desc: "New classroom, new friends, same love of learning.",
      relatedId: eduMishka2nd,
    },
    {
      date: "2024-08-19",
      title: "Started 3rd Grade",
      category: "Education",
      desc: "Ready for multiplication, cursive, and science experiments!",
      relatedId: eduMishka3rd,
    },
    {
      date: "2025-08-18",
      title: "Starting 4th Grade",
      category: "Education",
      desc: "Big year ahead — student council, science fair, and new challenges!",
      relatedId: eduMishka4th,
    },

    // Activities
    {
      date: "2021-06-01",
      title: "Started swimming lessons",
      category: "Activity",
      desc: "First day at Aqua Kids — was nervous but loved the water.",
      relatedId: actMishkaSwim,
    },
    {
      date: "2022-09-10",
      title: "Began piano classes",
      category: "Activity",
      desc: "First lesson with Mrs. Chen. Learned to play 'Twinkle Twinkle'.",
      relatedId: actMishkaPiano,
    },
    {
      date: "2023-01-15",
      title: "Joined art class",
      category: "Activity",
      desc: "Started at Creative Minds Studio. First project was a watercolor landscape.",
      relatedId: actMishkaArt,
    },
    {
      date: "2023-09-05",
      title: "Started dance classes",
      category: "Activity",
      desc: "First ballet class at Grace Dance Academy. Loved the tutu!",
      relatedId: actMishkaDance,
    },
    {
      date: "2023-12-16",
      title: "First piano recital",
      category: "Activity",
      desc: "Played 'Ode to Joy' at the winter recital. Didn't miss a note!",
    },
    {
      date: "2024-05-18",
      title: "Spring dance showcase",
      category: "Activity",
      desc: "Performed a ballet number with her class. Standing ovation from the family!",
    },
    {
      date: "2024-09-15",
      title: "Joined coding club",
      category: "Activity",
      desc: "After-school coding club using Scratch. Built her first animation on day one!",
      relatedId: actMishkaCoding,
    },

    // Competitions
    {
      date: "2024-04-20",
      title: "Science Fair — 2nd Place!",
      category: "Competition",
      desc: "Project on plant growth and music. Judges loved her data analysis skills.",
      relatedId: compMishkaScience,
    },
    {
      date: "2024-11-10",
      title: "Art Showcase — Honorable Mention",
      category: "Competition",
      desc: "Watercolor painting selected for community art center display.",
      relatedId: compMishkaArt,
    },
    {
      date: "2025-02-14",
      title: "Spelling Bee Champion!",
      category: "Competition",
      desc: "Won the school spelling bee! Correctly spelled 'magnificent' to clinch it.",
      relatedId: compMishkaSpelling,
    },
    {
      date: "2025-03-22",
      title: "Math Olympiad — Bronze Medal",
      category: "Competition",
      desc: "Competed against students from 12 schools. Incredible achievement!",
      relatedId: compMishkaMath,
    },

    // Camps
    {
      date: "2023-06-19",
      title: "STEM Camp begins",
      category: "Camp",
      desc: "Week at Camp Invention — robotics, engineering, and solar oven s'mores!",
      relatedId: campMishkaStem,
    },
    {
      date: "2024-07-08",
      title: "Art Camp starts",
      category: "Camp",
      desc: "Three weeks of painting, pottery, and animation at Creative Minds.",
      relatedId: campMishkaArt,
    },
    {
      date: "2025-06-16",
      title: "Nature Explorers Camp",
      category: "Camp",
      desc: "Off to two weeks of hiking, wildlife, and camping under the stars!",
      relatedId: campMishkaNature,
    },

    // Trips
    {
      date: "2022-12-22",
      title: "Disney World vacation!",
      category: "Trip",
      desc: "Holiday week at Disney! Met princesses, rode Space Mountain.",
      relatedId: tripDisney,
    },
    {
      date: "2023-06-10",
      title: "Grand Canyon trip",
      category: "Trip",
      desc: "Family adventure to the Grand Canyon. Earned Junior Ranger badge!",
      relatedId: tripCanyon,
    },
    {
      date: "2024-07-04",
      title: "Beach vacation — Outer Banks",
      category: "Trip",
      desc: "Week of sun, sand, boogie boarding, and dolphins!",
      relatedId: tripBeach,
    },
    {
      date: "2025-06-01",
      title: "National Parks road trip",
      category: "Trip",
      desc: "Yellowstone and Grand Teton — bears, geysers, and nature journals!",
      relatedId: tripParks,
    },

    // Growth
    {
      date: "2022-04-09",
      title: "Lost first tooth!",
      category: "Growth",
      desc: "The tooth fairy visited! Mishka left a note under her pillow.",
    },
    {
      date: "2022-10-01",
      title: "Riding bike without training wheels",
      category: "Growth",
      desc: "Took off the training wheels and rode down the street on her first try!",
    },
    {
      date: "2024-09-01",
      title: "Reached 50 inches tall",
      category: "Growth",
      desc: "Finally tall enough for all the big rides! Growing up so fast.",
    },
  ];

  for (const t of mishkaTimeline) {
    dataStore.registerObject(timelineEvent, {
      eventId: randomUUID(),
      kidId: MISHKA_ID,
      eventDate: t.date,
      eventTitle: t.title,
      eventCategory: t.category,
      description: t.desc,
      relatedEntityId: "relatedId" in t ? t.relatedId : undefined,
    });
  }

  // ============================================================
  // TIMELINE EVENTS — Nirek
  // ============================================================
  const nirekTimeline = [
    // Custom / Growth milestones
    {
      date: "2020-07-09",
      title: "Nirek is born!",
      category: "Custom",
      desc: "Welcome to the world, baby boy! Born at 11:15 AM, 20 inches and 7.8 lbs.",
    },
    {
      date: "2020-12-25",
      title: "First Christmas!",
      category: "Custom",
      desc: "Nirek's first Christmas. Mostly interested in the wrapping paper!",
    },
    {
      date: "2021-01-20",
      title: "First tooth!",
      category: "Growth",
      desc: "Bottom front tooth coming in. Lots of drooling!",
    },
    {
      date: "2021-06-15",
      title: "First steps!",
      category: "Growth",
      desc: "Took his first wobbly steps toward big sister Mishka.",
    },
    {
      date: "2021-07-09",
      title: "Nirek turns 1!",
      category: "Custom",
      desc: "Dinosaur-themed 1st birthday party! Loved smashing the cake.",
    },
    {
      date: "2022-03-10",
      title: "First word: 'Dada'",
      category: "Growth",
      desc: "Started talking! 'Dada', 'Mama', 'no', and 'dino' are favorites.",
    },
    {
      date: "2022-07-09",
      title: "Nirek turns 2!",
      category: "Custom",
      desc: "Truck-themed birthday party. Got his first balance bike!",
    },
    {
      date: "2023-03-15",
      title: "Potty trained!",
      category: "Growth",
      desc: "Fully potty trained — big milestone! Very proud of himself.",
    },

    // Education
    {
      date: "2023-09-05",
      title: "First day of Preschool",
      category: "Education",
      desc: "Started at Sunshine Montessori. A few tears at drop-off but happy by pickup!",
      relatedId: eduNirekPreschool,
    },
    {
      date: "2024-01-20",
      title: "Learned to write his name",
      category: "Education",
      desc: "Wrote N-I-R-E-K for the first time! Ran to show everyone.",
    },
    {
      date: "2024-06-14",
      title: "Preschool graduation",
      category: "Education",
      desc: "Tiny cap and gown! Sang a song and got a certificate. So adorable.",
    },
    {
      date: "2024-09-03",
      title: "Started Pre-K",
      category: "Education",
      desc: "Back at Sunshine Montessori for Pre-K. Already knows all his classmates!",
      relatedId: eduNirekPreK,
    },
    {
      date: "2025-06-13",
      title: "Pre-K graduation",
      category: "Education",
      desc: "Ready for kindergarten! Sang 'This Land is Your Land' at the ceremony.",
    },
    {
      date: "2025-08-18",
      title: "Starting Kindergarten!",
      category: "Education",
      desc: "First day at Maplewood Elementary, same school as Mishka! So excited!",
      relatedId: eduNirekKinder,
    },

    // Activities
    {
      date: "2023-06-01",
      title: "Started swimming lessons",
      category: "Activity",
      desc: "First time at Aqua Kids with big sister. Loved blowing bubbles!",
      relatedId: actNirekSwim,
    },
    {
      date: "2024-03-01",
      title: "Joined soccer team",
      category: "Activity",
      desc: "First practice with Little Kickers. Discovered he loves being goalie!",
      relatedId: actNirekSoccer,
    },
    {
      date: "2024-09-10",
      title: "Started drawing class",
      category: "Activity",
      desc: "First class at Creative Minds Studio. Drew a T-Rex on day one!",
      relatedId: actNirekDrawing,
    },
    {
      date: "2025-01-15",
      title: "Started karate",
      category: "Activity",
      desc: "First karate class! Got his white belt and couldn't stop doing kicks at home.",
      relatedId: actNirekKarate,
    },

    // Competitions
    {
      date: "2024-05-15",
      title: "Art Contest — Most Creative!",
      category: "Competition",
      desc: "Won 'Most Creative' at the preschool art contest with his dinosaur volcano drawing.",
      relatedId: compNirekArt,
    },
    {
      date: "2024-10-19",
      title: "Soccer Tournament — 2nd Place",
      category: "Competition",
      desc: "Blue Lightning made the finals! Nirek got 'Best Sportsmanship' award.",
      relatedId: compNirekSoccer,
    },

    // Camps
    {
      date: "2024-06-17",
      title: "First summer camp!",
      category: "Camp",
      desc: "Little Explorers Mini Camp — water play, dinosaur digs, and new friends.",
      relatedId: campNirekMini,
    },
    {
      date: "2025-06-23",
      title: "Sports camp begins",
      category: "Camp",
      desc: "All-Stars Sports Camp — basketball, baseball, tennis, and obstacle courses!",
      relatedId: campNirekSports,
    },

    // Trips
    {
      date: "2022-12-22",
      title: "First Disney World trip!",
      category: "Trip",
      desc: "Met Mickey Mouse and rode the Buzz Lightyear ride five times!",
      relatedId: tripDisney,
    },
    {
      date: "2023-06-10",
      title: "Grand Canyon adventure",
      category: "Trip",
      desc: "Kept saying 'big hole!' and loved spotting elk from the shuttle bus.",
      relatedId: tripCanyon,
    },
    {
      date: "2024-07-04",
      title: "Beach vacation!",
      category: "Trip",
      desc: "Outer Banks — waves, shells, sandcastles, and ice cream every day!",
      relatedId: tripBeach,
    },
    {
      date: "2025-06-01",
      title: "National Parks road trip",
      category: "Trip",
      desc: "Yellowstone bison, Old Faithful eruptions, and Junior Ranger adventures!",
      relatedId: tripParks,
    },

    // Growth
    {
      date: "2022-10-15",
      title: "Riding balance bike",
      category: "Growth",
      desc: "Mastered the balance bike — zooming around the neighborhood!",
    },
    {
      date: "2024-04-20",
      title: "Counting to 50!",
      category: "Growth",
      desc: "Can count to 50 and recognizes all letters. Kindergarten ready!",
    },
    {
      date: "2025-04-01",
      title: "Reading sight words",
      category: "Growth",
      desc: "Started reading simple sight words — 'the', 'and', 'is', 'cat'. So exciting!",
    },
  ];

  for (const t of nirekTimeline) {
    dataStore.registerObject(timelineEvent, {
      eventId: randomUUID(),
      kidId: NIREK_ID,
      eventDate: t.date,
      eventTitle: t.title,
      eventCategory: t.category,
      description: t.desc,
      relatedEntityId: "relatedId" in t ? t.relatedId : undefined,
    });
  }
};
