export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Profile: undefined;
  PasswordChange: undefined;
  EarlierFav: undefined;
  Settings: undefined;
  MyBookings: undefined;
  MyTableBookings: undefined;
  MyIssues: undefined;
  Location: undefined;
  QRScanner: undefined;
  Target: { startId: string; endId?: string };
  Booking: {
    prefillData?: {
      roomId?: string;
      roomDetails?: any;
    }
  };
  Gastronomy: undefined;
  DailyOffer: undefined;
  FoodMenu: undefined;
  DrinkMenu: undefined;
  OpeningHours: undefined;
  OpeningHoursBar: undefined;
  TableBooking: { prefillData?: { tableSize?: number | null; specialRequest?: string } } | undefined;
  UploadRooms: undefined;
  /* Issue: { photoPath?: string } | undefined;
  PhotoCapture: undefined; */
  Issue: {
    photoPath?: string;
    tempRoom?: string;
    tempDescription?: string;
  };
  PhotoCapture: {
    tempRoom?: string;
    tempDescription?: string;
  };
};
