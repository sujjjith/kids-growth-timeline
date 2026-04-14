import {
  actionType,
  createObjectActionImplementation,
  modifyObjectActionImplementation,
  deleteObjectActionImplementation,
  objectType,
  oneToManyLinkType,
  ontology,
} from "@palantir/pilot-ontology-api";

// ============================================================
// OBJECT TYPES
// ============================================================

const kidProfile = objectType({
  apiName: "kidProfile",
  displayName: "Kid Profile",
  pluralDisplayName: "Kid Profiles",
  icon: { name: "person", color: "#7157D9" },
  properties: {
    kidId: {
      displayName: "Kid ID",
      nullable: false,
      type: { type: "string" },
    },
    firstName: {
      displayName: "First Name",
      nullable: false,
      type: { type: "string" },
    },
    lastName: {
      displayName: "Last Name",
      nullable: true,
      type: { type: "string" },
    },
    dateOfBirth: {
      displayName: "Date of Birth",
      nullable: false,
      type: { type: "date" },
    },
    gender: {
      displayName: "Gender",
      nullable: false,
      type: { type: "string" },
    },
    nickname: {
      displayName: "Nickname",
      nullable: true,
      type: { type: "string" },
    },
    notes: {
      displayName: "Notes",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "kidId",
  titlePropertyApiName: "firstName",
});

const educationRecord = objectType({
  apiName: "educationRecord",
  displayName: "Education Record",
  pluralDisplayName: "Education Records",
  icon: { name: "learning", color: "#2965CC" },
  properties: {
    educationId: {
      displayName: "Education ID",
      nullable: false,
      type: { type: "string" },
    },
    kidId: {
      displayName: "Kid ID",
      nullable: false,
      type: { type: "string" },
    },
    schoolName: {
      displayName: "School Name",
      nullable: false,
      type: { type: "string" },
    },
    grade: {
      displayName: "Grade / Year",
      nullable: true,
      type: { type: "string" },
    },
    startDate: {
      displayName: "Start Date",
      nullable: false,
      type: { type: "date" },
    },
    endDate: {
      displayName: "End Date",
      nullable: true,
      type: { type: "date" },
    },
    achievement: {
      displayName: "Achievement / Milestone",
      nullable: true,
      type: { type: "string" },
    },
    description: {
      displayName: "Description",
      nullable: true,
      type: { type: "string" },
    },
    category: {
      displayName: "Category",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "educationId",
  titlePropertyApiName: "schoolName",
});

const activity = objectType({
  apiName: "kidActivity",
  displayName: "Activity",
  pluralDisplayName: "Activities",
  icon: { name: "walk", color: "#0F9960" },
  properties: {
    activityId: {
      displayName: "Activity ID",
      nullable: false,
      type: { type: "string" },
    },
    kidId: {
      displayName: "Kid ID",
      nullable: false,
      type: { type: "string" },
    },
    activityName: {
      displayName: "Activity Name",
      nullable: false,
      type: { type: "string" },
    },
    activityType: {
      displayName: "Type",
      nullable: false,
      type: { type: "string" },
    },
    provider: {
      displayName: "Provider / Instructor",
      nullable: true,
      type: { type: "string" },
    },
    startDate: {
      displayName: "Start Date",
      nullable: false,
      type: { type: "date" },
    },
    endDate: {
      displayName: "End Date",
      nullable: true,
      type: { type: "date" },
    },
    dayOfWeek: {
      displayName: "Day of Week",
      nullable: true,
      type: { type: "string" },
    },
    description: {
      displayName: "Description",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "activityId",
  titlePropertyApiName: "activityName",
});

const competition = objectType({
  apiName: "kidCompetition",
  displayName: "Competition",
  pluralDisplayName: "Competitions",
  icon: { name: "trophy", color: "#D9822B" },
  properties: {
    competitionId: {
      displayName: "Competition ID",
      nullable: false,
      type: { type: "string" },
    },
    kidId: {
      displayName: "Kid ID",
      nullable: false,
      type: { type: "string" },
    },
    competitionName: {
      displayName: "Competition Name",
      nullable: false,
      type: { type: "string" },
    },
    competitionType: {
      displayName: "Type",
      nullable: true,
      type: { type: "string" },
    },
    eventDate: {
      displayName: "Event Date",
      nullable: false,
      type: { type: "date" },
    },
    result: {
      displayName: "Result / Award",
      nullable: true,
      type: { type: "string" },
    },
    placement: {
      displayName: "Placement",
      nullable: true,
      type: { type: "string" },
    },
    description: {
      displayName: "Description",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "competitionId",
  titlePropertyApiName: "competitionName",
});

const summerCamp = objectType({
  apiName: "summerCamp",
  displayName: "Summer Camp",
  pluralDisplayName: "Summer Camps",
  icon: { name: "tree", color: "#1D7324" },
  properties: {
    campId: {
      displayName: "Camp ID",
      nullable: false,
      type: { type: "string" },
    },
    kidId: {
      displayName: "Kid ID",
      nullable: false,
      type: { type: "string" },
    },
    campName: {
      displayName: "Camp Name",
      nullable: false,
      type: { type: "string" },
    },
    campType: {
      displayName: "Camp Type",
      nullable: true,
      type: { type: "string" },
    },
    location: {
      displayName: "Location",
      nullable: true,
      type: { type: "string" },
    },
    startDate: {
      displayName: "Start Date",
      nullable: false,
      type: { type: "date" },
    },
    endDate: {
      displayName: "End Date",
      nullable: true,
      type: { type: "date" },
    },
    highlights: {
      displayName: "Highlights",
      nullable: true,
      type: { type: "string" },
    },
    description: {
      displayName: "Description",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "campId",
  titlePropertyApiName: "campName",
});

const vacationTrip = objectType({
  apiName: "vacationTrip",
  displayName: "Vacation Trip",
  pluralDisplayName: "Vacation Trips",
  icon: { name: "airplane", color: "#137CBD" },
  properties: {
    tripId: {
      displayName: "Trip ID",
      nullable: false,
      type: { type: "string" },
    },
    kidId: {
      displayName: "Kid ID",
      nullable: false,
      type: { type: "string" },
    },
    tripType: {
      displayName: "Trip Type",
      nullable: false,
      type: { type: "string" },
    },
    tripName: {
      displayName: "Trip Name",
      nullable: false,
      type: { type: "string" },
    },
    destination: {
      displayName: "Destination",
      nullable: false,
      type: { type: "string" },
    },
    startDate: {
      displayName: "Start Date",
      nullable: false,
      type: { type: "date" },
    },
    endDate: {
      displayName: "End Date",
      nullable: true,
      type: { type: "date" },
    },
    highlights: {
      displayName: "Highlights",
      nullable: true,
      type: { type: "string" },
    },
    description: {
      displayName: "Description",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "tripId",
  titlePropertyApiName: "tripName",
});

const growthMeasurement = objectType({
  apiName: "growthMeasurement",
  displayName: "Growth Measurement",
  pluralDisplayName: "Growth Measurements",
  icon: { name: "pulse", color: "#DB2C6F" },
  properties: {
    measurementId: {
      displayName: "Measurement ID",
      nullable: false,
      type: { type: "string" },
    },
    kidId: {
      displayName: "Kid ID",
      nullable: false,
      type: { type: "string" },
    },
    measurementDate: {
      displayName: "Measurement Date",
      nullable: false,
      type: { type: "date" },
    },
    heightInches: {
      displayName: "Height (inches)",
      nullable: true,
      type: { type: "double" },
    },
    weightLbs: {
      displayName: "Weight (lbs)",
      nullable: true,
      type: { type: "double" },
    },
    notes: {
      displayName: "Notes",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "measurementId",
  titlePropertyApiName: "measurementId",
});

const timelineEvent = objectType({
  apiName: "timelineEvent",
  displayName: "Timeline Event",
  pluralDisplayName: "Timeline Events",
  icon: { name: "timeline-events", color: "#5642A6" },
  properties: {
    eventId: {
      displayName: "Event ID",
      nullable: false,
      type: { type: "string" },
    },
    kidId: {
      displayName: "Kid ID",
      nullable: false,
      type: { type: "string" },
    },
    eventDate: {
      displayName: "Event Date",
      nullable: false,
      type: { type: "date" },
    },
    eventTitle: {
      displayName: "Event Title",
      nullable: false,
      type: { type: "string" },
    },
    eventCategory: {
      displayName: "Category",
      nullable: false,
      type: { type: "string" },
    },
    description: {
      displayName: "Description",
      nullable: true,
      type: { type: "string" },
    },
    relatedEntityId: {
      displayName: "Related Entity ID",
      nullable: true,
      type: { type: "string" },
    },
  },
  primaryKeyPropertyApiName: "eventId",
  titlePropertyApiName: "eventTitle",
});

// ============================================================
// ACTIONS - Kid Profile
// ============================================================

const createKidProfile = actionType({
  apiName: "create-kid-profile",
  displayName: "Create Kid Profile",
  icon: { name: "new-person", color: "#0F9960" },
  parameters: {
    kidId: { displayName: "Kid ID", required: true, type: { type: "string" } },
    firstName: { displayName: "First Name", required: true, type: { type: "string" } },
    lastName: { displayName: "Last Name", required: false, type: { type: "string" } },
    dateOfBirth: { displayName: "Date of Birth", required: true, type: { type: "date" } },
    gender: { displayName: "Gender", required: true, type: { type: "string" } },
    nickname: { displayName: "Nickname", required: false, type: { type: "string" } },
    notes: { displayName: "Notes", required: false, type: { type: "string" } },
  },
});

const createKidProfileImpl = createObjectActionImplementation({
  actionType: createKidProfile,
  objectType: kidProfile,
  parameterMapping: {
    kidId: "kidId",
    firstName: "firstName",
    lastName: "lastName",
    dateOfBirth: "dateOfBirth",
    gender: "gender",
    nickname: "nickname",
    notes: "notes",
  },
});

const editKidProfile = actionType({
  apiName: "edit-kid-profile",
  displayName: "Edit Kid Profile",
  icon: { name: "edit", color: "#D9822B" },
  parameters: {
    kidProfile: {
      displayName: "Kid Profile",
      required: true,
      type: { type: "object", objectTypeApiName: "kidProfile" },
    },
    firstName: { displayName: "First Name", required: true, type: { type: "string" } },
    lastName: { displayName: "Last Name", required: false, type: { type: "string" } },
    gender: { displayName: "Gender", required: true, type: { type: "string" } },
    nickname: { displayName: "Nickname", required: false, type: { type: "string" } },
    notes: { displayName: "Notes", required: false, type: { type: "string" } },
  },
});

const editKidProfileImpl = modifyObjectActionImplementation({
  actionType: editKidProfile,
  objectType: kidProfile,
  primaryKeyParameter: "kidProfile",
  parameterMapping: {
    firstName: "firstName",
    lastName: "lastName",
    gender: "gender",
    nickname: "nickname",
    notes: "notes",
  },
});

const deleteKidProfile = actionType({
  apiName: "delete-kid-profile",
  displayName: "Delete Kid Profile",
  icon: { name: "trash", color: "#DB3737" },
  parameters: {
    kidProfile: {
      displayName: "Kid Profile",
      required: true,
      type: { type: "object", objectTypeApiName: "kidProfile" },
    },
  },
});

const deleteKidProfileImpl = deleteObjectActionImplementation({
  actionType: deleteKidProfile,
  objectType: kidProfile,
  primaryKeyParameter: "kidProfile",
});

// ============================================================
// ACTIONS - Education Record
// ============================================================

const createEducationRecord = actionType({
  apiName: "create-education-record",
  displayName: "Add Education Record",
  icon: { name: "plus", color: "#2965CC" },
  parameters: {
    educationId: { displayName: "Education ID", required: true, type: { type: "string" } },
    kidId: { displayName: "Kid ID", required: true, type: { type: "string" } },
    schoolName: { displayName: "School Name", required: true, type: { type: "string" } },
    grade: { displayName: "Grade / Year", required: false, type: { type: "string" } },
    startDate: { displayName: "Start Date", required: true, type: { type: "date" } },
    endDate: { displayName: "End Date", required: false, type: { type: "date" } },
    achievement: { displayName: "Achievement", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
    category: { displayName: "Category", required: false, type: { type: "string" } },
  },
});

const createEducationRecordImpl = createObjectActionImplementation({
  actionType: createEducationRecord,
  objectType: educationRecord,
  parameterMapping: {
    educationId: "educationId",
    kidId: "kidId",
    schoolName: "schoolName",
    grade: "grade",
    startDate: "startDate",
    endDate: "endDate",
    achievement: "achievement",
    description: "description",
    category: "category",
  },
});

const editEducationRecord = actionType({
  apiName: "edit-education-record",
  displayName: "Edit Education Record",
  icon: { name: "edit", color: "#D9822B" },
  parameters: {
    educationRecord: {
      displayName: "Education Record",
      required: true,
      type: { type: "object", objectTypeApiName: "educationRecord" },
    },
    schoolName: { displayName: "School Name", required: true, type: { type: "string" } },
    grade: { displayName: "Grade / Year", required: false, type: { type: "string" } },
    startDate: { displayName: "Start Date", required: true, type: { type: "date" } },
    endDate: { displayName: "End Date", required: false, type: { type: "date" } },
    achievement: { displayName: "Achievement", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
    category: { displayName: "Category", required: false, type: { type: "string" } },
  },
});

const editEducationRecordImpl = modifyObjectActionImplementation({
  actionType: editEducationRecord,
  objectType: educationRecord,
  primaryKeyParameter: "educationRecord",
  parameterMapping: {
    schoolName: "schoolName",
    grade: "grade",
    startDate: "startDate",
    endDate: "endDate",
    achievement: "achievement",
    description: "description",
    category: "category",
  },
});

const deleteEducationRecord = actionType({
  apiName: "delete-education-record",
  displayName: "Delete Education Record",
  icon: { name: "trash", color: "#DB3737" },
  parameters: {
    educationRecord: {
      displayName: "Education Record",
      required: true,
      type: { type: "object", objectTypeApiName: "educationRecord" },
    },
  },
});

const deleteEducationRecordImpl = deleteObjectActionImplementation({
  actionType: deleteEducationRecord,
  objectType: educationRecord,
  primaryKeyParameter: "educationRecord",
});

// ============================================================
// ACTIONS - Activity
// ============================================================

const createActivity = actionType({
  apiName: "create-kid-activity",
  displayName: "Add Activity",
  icon: { name: "plus", color: "#0F9960" },
  parameters: {
    activityId: { displayName: "Activity ID", required: true, type: { type: "string" } },
    kidId: { displayName: "Kid ID", required: true, type: { type: "string" } },
    activityName: { displayName: "Activity Name", required: true, type: { type: "string" } },
    activityType: { displayName: "Type", required: true, type: { type: "string" } },
    provider: { displayName: "Provider / Instructor", required: false, type: { type: "string" } },
    startDate: { displayName: "Start Date", required: true, type: { type: "date" } },
    endDate: { displayName: "End Date", required: false, type: { type: "date" } },
    dayOfWeek: { displayName: "Day of Week", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
  },
});

const createActivityImpl = createObjectActionImplementation({
  actionType: createActivity,
  objectType: activity,
  parameterMapping: {
    activityId: "activityId",
    kidId: "kidId",
    activityName: "activityName",
    activityType: "activityType",
    provider: "provider",
    startDate: "startDate",
    endDate: "endDate",
    dayOfWeek: "dayOfWeek",
    description: "description",
  },
});

const editActivity = actionType({
  apiName: "edit-kid-activity",
  displayName: "Edit Activity",
  icon: { name: "edit", color: "#D9822B" },
  parameters: {
    kidActivity: {
      displayName: "Activity",
      required: true,
      type: { type: "object", objectTypeApiName: "kidActivity" },
    },
    activityName: { displayName: "Activity Name", required: true, type: { type: "string" } },
    activityType: { displayName: "Type", required: true, type: { type: "string" } },
    provider: { displayName: "Provider / Instructor", required: false, type: { type: "string" } },
    startDate: { displayName: "Start Date", required: true, type: { type: "date" } },
    endDate: { displayName: "End Date", required: false, type: { type: "date" } },
    dayOfWeek: { displayName: "Day of Week", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
  },
});

const editActivityImpl = modifyObjectActionImplementation({
  actionType: editActivity,
  objectType: activity,
  primaryKeyParameter: "kidActivity",
  parameterMapping: {
    activityName: "activityName",
    activityType: "activityType",
    provider: "provider",
    startDate: "startDate",
    endDate: "endDate",
    dayOfWeek: "dayOfWeek",
    description: "description",
  },
});

const deleteActivity = actionType({
  apiName: "delete-kid-activity",
  displayName: "Delete Activity",
  icon: { name: "trash", color: "#DB3737" },
  parameters: {
    kidActivity: {
      displayName: "Activity",
      required: true,
      type: { type: "object", objectTypeApiName: "kidActivity" },
    },
  },
});

const deleteActivityImpl = deleteObjectActionImplementation({
  actionType: deleteActivity,
  objectType: activity,
  primaryKeyParameter: "kidActivity",
});

// ============================================================
// ACTIONS - Competition
// ============================================================

const createCompetition = actionType({
  apiName: "create-kid-competition",
  displayName: "Add Competition",
  icon: { name: "plus", color: "#D9822B" },
  parameters: {
    competitionId: { displayName: "Competition ID", required: true, type: { type: "string" } },
    kidId: { displayName: "Kid ID", required: true, type: { type: "string" } },
    competitionName: { displayName: "Competition Name", required: true, type: { type: "string" } },
    competitionType: { displayName: "Type", required: false, type: { type: "string" } },
    eventDate: { displayName: "Event Date", required: true, type: { type: "date" } },
    result: { displayName: "Result / Award", required: false, type: { type: "string" } },
    placement: { displayName: "Placement", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
  },
});

const createCompetitionImpl = createObjectActionImplementation({
  actionType: createCompetition,
  objectType: competition,
  parameterMapping: {
    competitionId: "competitionId",
    kidId: "kidId",
    competitionName: "competitionName",
    competitionType: "competitionType",
    eventDate: "eventDate",
    result: "result",
    placement: "placement",
    description: "description",
  },
});

const editCompetition = actionType({
  apiName: "edit-kid-competition",
  displayName: "Edit Competition",
  icon: { name: "edit", color: "#D9822B" },
  parameters: {
    kidCompetition: {
      displayName: "Competition",
      required: true,
      type: { type: "object", objectTypeApiName: "kidCompetition" },
    },
    competitionName: { displayName: "Competition Name", required: true, type: { type: "string" } },
    competitionType: { displayName: "Type", required: false, type: { type: "string" } },
    eventDate: { displayName: "Event Date", required: true, type: { type: "date" } },
    result: { displayName: "Result / Award", required: false, type: { type: "string" } },
    placement: { displayName: "Placement", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
  },
});

const editCompetitionImpl = modifyObjectActionImplementation({
  actionType: editCompetition,
  objectType: competition,
  primaryKeyParameter: "kidCompetition",
  parameterMapping: {
    competitionName: "competitionName",
    competitionType: "competitionType",
    eventDate: "eventDate",
    result: "result",
    placement: "placement",
    description: "description",
  },
});

const deleteCompetition = actionType({
  apiName: "delete-kid-competition",
  displayName: "Delete Competition",
  icon: { name: "trash", color: "#DB3737" },
  parameters: {
    kidCompetition: {
      displayName: "Competition",
      required: true,
      type: { type: "object", objectTypeApiName: "kidCompetition" },
    },
  },
});

const deleteCompetitionImpl = deleteObjectActionImplementation({
  actionType: deleteCompetition,
  objectType: competition,
  primaryKeyParameter: "kidCompetition",
});

// ============================================================
// ACTIONS - Summer Camp
// ============================================================

const createSummerCamp = actionType({
  apiName: "create-summer-camp",
  displayName: "Add Summer Camp",
  icon: { name: "plus", color: "#1D7324" },
  parameters: {
    campId: { displayName: "Camp ID", required: true, type: { type: "string" } },
    kidId: { displayName: "Kid ID", required: true, type: { type: "string" } },
    campName: { displayName: "Camp Name", required: true, type: { type: "string" } },
    campType: { displayName: "Camp Type", required: false, type: { type: "string" } },
    location: { displayName: "Location", required: false, type: { type: "string" } },
    startDate: { displayName: "Start Date", required: true, type: { type: "date" } },
    endDate: { displayName: "End Date", required: false, type: { type: "date" } },
    highlights: { displayName: "Highlights", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
  },
});

const createSummerCampImpl = createObjectActionImplementation({
  actionType: createSummerCamp,
  objectType: summerCamp,
  parameterMapping: {
    campId: "campId",
    kidId: "kidId",
    campName: "campName",
    campType: "campType",
    location: "location",
    startDate: "startDate",
    endDate: "endDate",
    highlights: "highlights",
    description: "description",
  },
});

const editSummerCamp = actionType({
  apiName: "edit-summer-camp",
  displayName: "Edit Summer Camp",
  icon: { name: "edit", color: "#D9822B" },
  parameters: {
    summerCamp: {
      displayName: "Summer Camp",
      required: true,
      type: { type: "object", objectTypeApiName: "summerCamp" },
    },
    campName: { displayName: "Camp Name", required: true, type: { type: "string" } },
    campType: { displayName: "Camp Type", required: false, type: { type: "string" } },
    location: { displayName: "Location", required: false, type: { type: "string" } },
    startDate: { displayName: "Start Date", required: true, type: { type: "date" } },
    endDate: { displayName: "End Date", required: false, type: { type: "date" } },
    highlights: { displayName: "Highlights", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
  },
});

const editSummerCampImpl = modifyObjectActionImplementation({
  actionType: editSummerCamp,
  objectType: summerCamp,
  primaryKeyParameter: "summerCamp",
  parameterMapping: {
    campName: "campName",
    campType: "campType",
    location: "location",
    startDate: "startDate",
    endDate: "endDate",
    highlights: "highlights",
    description: "description",
  },
});

const deleteSummerCamp = actionType({
  apiName: "delete-summer-camp",
  displayName: "Delete Summer Camp",
  icon: { name: "trash", color: "#DB3737" },
  parameters: {
    summerCamp: {
      displayName: "Summer Camp",
      required: true,
      type: { type: "object", objectTypeApiName: "summerCamp" },
    },
  },
});

const deleteSummerCampImpl = deleteObjectActionImplementation({
  actionType: deleteSummerCamp,
  objectType: summerCamp,
  primaryKeyParameter: "summerCamp",
});

// ============================================================
// ACTIONS - Vacation Trip
// ============================================================

const createVacationTrip = actionType({
  apiName: "create-vacation-trip",
  displayName: "Add Vacation Trip",
  icon: { name: "plus", color: "#137CBD" },
  parameters: {
    tripId: { displayName: "Trip ID", required: true, type: { type: "string" } },
    kidId: { displayName: "Kid ID", required: true, type: { type: "string" } },
    tripType: { displayName: "Trip Type", required: true, type: { type: "string" } },
    tripName: { displayName: "Trip Name", required: true, type: { type: "string" } },
    destination: { displayName: "Destination", required: true, type: { type: "string" } },
    startDate: { displayName: "Start Date", required: true, type: { type: "date" } },
    endDate: { displayName: "End Date", required: false, type: { type: "date" } },
    highlights: { displayName: "Highlights", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
  },
});

const createVacationTripImpl = createObjectActionImplementation({
  actionType: createVacationTrip,
  objectType: vacationTrip,
  parameterMapping: {
    tripId: "tripId",
    kidId: "kidId",
    tripType: "tripType",
    tripName: "tripName",
    destination: "destination",
    startDate: "startDate",
    endDate: "endDate",
    highlights: "highlights",
    description: "description",
  },
});

const editVacationTrip = actionType({
  apiName: "edit-vacation-trip",
  displayName: "Edit Vacation Trip",
  icon: { name: "edit", color: "#D9822B" },
  parameters: {
    vacationTrip: {
      displayName: "Vacation Trip",
      required: true,
      type: { type: "object", objectTypeApiName: "vacationTrip" },
    },
    tripType: { displayName: "Trip Type", required: true, type: { type: "string" } },
    tripName: { displayName: "Trip Name", required: true, type: { type: "string" } },
    destination: { displayName: "Destination", required: true, type: { type: "string" } },
    startDate: { displayName: "Start Date", required: true, type: { type: "date" } },
    endDate: { displayName: "End Date", required: false, type: { type: "date" } },
    highlights: { displayName: "Highlights", required: false, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
  },
});

const editVacationTripImpl = modifyObjectActionImplementation({
  actionType: editVacationTrip,
  objectType: vacationTrip,
  primaryKeyParameter: "vacationTrip",
  parameterMapping: {
    tripType: "tripType",
    tripName: "tripName",
    destination: "destination",
    startDate: "startDate",
    endDate: "endDate",
    highlights: "highlights",
    description: "description",
  },
});

const deleteVacationTrip = actionType({
  apiName: "delete-vacation-trip",
  displayName: "Delete Vacation Trip",
  icon: { name: "trash", color: "#DB3737" },
  parameters: {
    vacationTrip: {
      displayName: "Vacation Trip",
      required: true,
      type: { type: "object", objectTypeApiName: "vacationTrip" },
    },
  },
});

const deleteVacationTripImpl = deleteObjectActionImplementation({
  actionType: deleteVacationTrip,
  objectType: vacationTrip,
  primaryKeyParameter: "vacationTrip",
});

// ============================================================
// ACTIONS - Growth Measurement
// ============================================================

const createGrowthMeasurement = actionType({
  apiName: "create-growth-measurement",
  displayName: "Add Growth Measurement",
  icon: { name: "plus", color: "#DB2C6F" },
  parameters: {
    measurementId: { displayName: "Measurement ID", required: true, type: { type: "string" } },
    kidId: { displayName: "Kid ID", required: true, type: { type: "string" } },
    measurementDate: { displayName: "Date", required: true, type: { type: "date" } },
    heightInches: { displayName: "Height (inches)", required: false, type: { type: "double" } },
    weightLbs: { displayName: "Weight (lbs)", required: false, type: { type: "double" } },
    notes: { displayName: "Notes", required: false, type: { type: "string" } },
  },
});

const createGrowthMeasurementImpl = createObjectActionImplementation({
  actionType: createGrowthMeasurement,
  objectType: growthMeasurement,
  parameterMapping: {
    measurementId: "measurementId",
    kidId: "kidId",
    measurementDate: "measurementDate",
    heightInches: "heightInches",
    weightLbs: "weightLbs",
    notes: "notes",
  },
});

const editGrowthMeasurement = actionType({
  apiName: "edit-growth-measurement",
  displayName: "Edit Growth Measurement",
  icon: { name: "edit", color: "#D9822B" },
  parameters: {
    growthMeasurement: {
      displayName: "Growth Measurement",
      required: true,
      type: { type: "object", objectTypeApiName: "growthMeasurement" },
    },
    measurementDate: { displayName: "Date", required: true, type: { type: "date" } },
    heightInches: { displayName: "Height (inches)", required: false, type: { type: "double" } },
    weightLbs: { displayName: "Weight (lbs)", required: false, type: { type: "double" } },
    notes: { displayName: "Notes", required: false, type: { type: "string" } },
  },
});

const editGrowthMeasurementImpl = modifyObjectActionImplementation({
  actionType: editGrowthMeasurement,
  objectType: growthMeasurement,
  primaryKeyParameter: "growthMeasurement",
  parameterMapping: {
    measurementDate: "measurementDate",
    heightInches: "heightInches",
    weightLbs: "weightLbs",
    notes: "notes",
  },
});

const deleteGrowthMeasurement = actionType({
  apiName: "delete-growth-measurement",
  displayName: "Delete Growth Measurement",
  icon: { name: "trash", color: "#DB3737" },
  parameters: {
    growthMeasurement: {
      displayName: "Growth Measurement",
      required: true,
      type: { type: "object", objectTypeApiName: "growthMeasurement" },
    },
  },
});

const deleteGrowthMeasurementImpl = deleteObjectActionImplementation({
  actionType: deleteGrowthMeasurement,
  objectType: growthMeasurement,
  primaryKeyParameter: "growthMeasurement",
});

// ============================================================
// ACTIONS - Timeline Event
// ============================================================

const createTimelineEvent = actionType({
  apiName: "create-timeline-event",
  displayName: "Add Timeline Event",
  icon: { name: "plus", color: "#5642A6" },
  parameters: {
    eventId: { displayName: "Event ID", required: true, type: { type: "string" } },
    kidId: { displayName: "Kid ID", required: true, type: { type: "string" } },
    eventDate: { displayName: "Event Date", required: true, type: { type: "date" } },
    eventTitle: { displayName: "Event Title", required: true, type: { type: "string" } },
    eventCategory: { displayName: "Category", required: true, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
    relatedEntityId: { displayName: "Related Entity ID", required: false, type: { type: "string" } },
  },
});

const createTimelineEventImpl = createObjectActionImplementation({
  actionType: createTimelineEvent,
  objectType: timelineEvent,
  parameterMapping: {
    eventId: "eventId",
    kidId: "kidId",
    eventDate: "eventDate",
    eventTitle: "eventTitle",
    eventCategory: "eventCategory",
    description: "description",
    relatedEntityId: "relatedEntityId",
  },
});

const editTimelineEvent = actionType({
  apiName: "edit-timeline-event",
  displayName: "Edit Timeline Event",
  icon: { name: "edit", color: "#D9822B" },
  parameters: {
    timelineEvent: {
      displayName: "Timeline Event",
      required: true,
      type: { type: "object", objectTypeApiName: "timelineEvent" },
    },
    eventDate: { displayName: "Event Date", required: true, type: { type: "date" } },
    eventTitle: { displayName: "Event Title", required: true, type: { type: "string" } },
    eventCategory: { displayName: "Category", required: true, type: { type: "string" } },
    description: { displayName: "Description", required: false, type: { type: "string" } },
    relatedEntityId: { displayName: "Related Entity ID", required: false, type: { type: "string" } },
  },
});

const editTimelineEventImpl = modifyObjectActionImplementation({
  actionType: editTimelineEvent,
  objectType: timelineEvent,
  primaryKeyParameter: "timelineEvent",
  parameterMapping: {
    eventDate: "eventDate",
    eventTitle: "eventTitle",
    eventCategory: "eventCategory",
    description: "description",
    relatedEntityId: "relatedEntityId",
  },
});

const deleteTimelineEvent = actionType({
  apiName: "delete-timeline-event",
  displayName: "Delete Timeline Event",
  icon: { name: "trash", color: "#DB3737" },
  parameters: {
    timelineEvent: {
      displayName: "Timeline Event",
      required: true,
      type: { type: "object", objectTypeApiName: "timelineEvent" },
    },
  },
});

const deleteTimelineEventImpl = deleteObjectActionImplementation({
  actionType: deleteTimelineEvent,
  objectType: timelineEvent,
  primaryKeyParameter: "timelineEvent",
});

// ============================================================
// LINK TYPES - all entities link back to KidProfile
// ============================================================

const kidToEducation = oneToManyLinkType({
  one: {
    objectType: kidProfile,
    linkApiName: "kidToEducationRecords",
  },
  toMany: {
    objectType: educationRecord,
    linkApiName: "kidToEducationKid",
    foreignKeyPropertyApiName: "kidId",
  },
});

const kidToActivities = oneToManyLinkType({
  one: {
    objectType: kidProfile,
    linkApiName: "kidToActivities",
  },
  toMany: {
    objectType: activity,
    linkApiName: "kidToActivitiesKid",
    foreignKeyPropertyApiName: "kidId",
  },
});

const kidToCompetitions = oneToManyLinkType({
  one: {
    objectType: kidProfile,
    linkApiName: "kidToCompetitions",
  },
  toMany: {
    objectType: competition,
    linkApiName: "kidToCompetitionsKid",
    foreignKeyPropertyApiName: "kidId",
  },
});

const kidToCamps = oneToManyLinkType({
  one: {
    objectType: kidProfile,
    linkApiName: "kidToCamps",
  },
  toMany: {
    objectType: summerCamp,
    linkApiName: "kidToCampsKid",
    foreignKeyPropertyApiName: "kidId",
  },
});

const kidToTrips = oneToManyLinkType({
  one: {
    objectType: kidProfile,
    linkApiName: "kidToTrips",
  },
  toMany: {
    objectType: vacationTrip,
    linkApiName: "kidToTripsKid",
    foreignKeyPropertyApiName: "kidId",
  },
});

const kidToGrowth = oneToManyLinkType({
  one: {
    objectType: kidProfile,
    linkApiName: "kidToGrowthMeasurements",
  },
  toMany: {
    objectType: growthMeasurement,
    linkApiName: "kidToGrowthKid",
    foreignKeyPropertyApiName: "kidId",
  },
});

const kidToTimeline = oneToManyLinkType({
  one: {
    objectType: kidProfile,
    linkApiName: "kidToTimelineEvents",
  },
  toMany: {
    objectType: timelineEvent,
    linkApiName: "kidToTimelineKid",
    foreignKeyPropertyApiName: "kidId",
  },
});

// ============================================================
// ONTOLOGY EXPORT
// ============================================================

export const ontologyDefinition = ontology({
  objectTypes: [
    kidProfile,
    educationRecord,
    activity,
    competition,
    summerCamp,
    vacationTrip,
    growthMeasurement,
    timelineEvent,
  ],
  actionTypes: [
    createKidProfileImpl,
    editKidProfileImpl,
    deleteKidProfileImpl,
    createEducationRecordImpl,
    editEducationRecordImpl,
    deleteEducationRecordImpl,
    createActivityImpl,
    editActivityImpl,
    deleteActivityImpl,
    createCompetitionImpl,
    editCompetitionImpl,
    deleteCompetitionImpl,
    createSummerCampImpl,
    editSummerCampImpl,
    deleteSummerCampImpl,
    createVacationTripImpl,
    editVacationTripImpl,
    deleteVacationTripImpl,
    createGrowthMeasurementImpl,
    editGrowthMeasurementImpl,
    deleteGrowthMeasurementImpl,
    createTimelineEventImpl,
    editTimelineEventImpl,
    deleteTimelineEventImpl,
  ],
  linkTypes: [kidToEducation, kidToActivities, kidToCompetitions, kidToCamps, kidToTrips, kidToGrowth, kidToTimeline],
});
