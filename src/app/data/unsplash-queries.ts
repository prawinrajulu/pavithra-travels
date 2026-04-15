export const destinationQueryMap: Record<string, string> = {
  // Spiritual & Temple (1-9)
  "Badrinath Temple": "Badrinath Temple Uttarakhand India tourism",
  "Kedarnath Temple": "Kedarnath Temple Himalayas India temple",
  "Muktinath Temple": "Muktinath Temple Nepal mountains spiritual",
  "Amarnath Yatra": "Amarnath Yatra ice cave Himalayas India",
  "12 Jyotirlinga Temples": "Shiva Temple India spiritual ancient",
  "Shirdi Darshan": "Shirdi Sai Baba Temple Maharashtra India",
  "Gaya": "Gaya Vishnupad Temple Bihar India",
  "Prayagraj": "Prayagraj Triveni Sangam Kumbh Mela India",
  "Ayodhya": "Ayodhya Ram Mandir India temple architecture",

  // Scenic, Nature & Hill Stations (10-24)
  "Kerala": "Kerala lush greenery tea gardens tourism southern India",
  "Kerala Backwaters": "Kerala backwaters houseboat boat tourism India",
  "Gujarat": "Gujarat Rann of Kutch white desert tourism India",
  "Rajasthan": "Rajasthan fort desert Thar Jaipur heritage India",
  "Kashmir": "Kashmir valley snow mountains Dal Lake India",
  "Munnar": "Munnar tea gardens Kerala mountains tourism",
  "Dehradun": "Dehradun mountains Uttarakhand India valley",
  "Kullu": "Kullu valley mountains river Himachal India",
  "Manali": "Manali snow mountains Himalayas Himachal India",
  "Shimla": "Shimla mall road mountains Himachal India architecture",
  "Coorg": "Coorg coffee plantation mountains Karnataka India",
  "Mysore": "Mysore Palace Karnataka India heritage royal",
  "Darjeeling": "Darjeeling tea gardens Kanchenjunga mountains West Bengal",
  "Assam": "Assam Kaziranga rhino tea garden India",
  "Amritsar": "Amritsar Golden Temple Punjab India spiritual",

  // Border & International (25-29)
  "Attari Border": "Wagah border Attari ceremony ceremony India",
  "Sri Lanka": "Sri Lanka tropical beach ocean tourism",
  "Nepal": "Nepal mountains Everest Kathmandu tourism",
  "Bhutan": "Bhutan monastery Himalayas mountains tourism",
  "Sikkim": "Sikkim mountains Himalayas India tourism"
};

/**
 * Gets a clean search query for a destination name.
 * Fallback to the name itself if no mapping exists.
 */
export const getUnsplashQuery = (name: string): string => {
  return destinationQueryMap[name] || `${name} travel destination India`;
};
