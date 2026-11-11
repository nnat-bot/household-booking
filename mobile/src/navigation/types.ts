export type AuthStackParams = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type RootStackParams = {
  Tabs: undefined;
  CleanerList: { category: string; title: string };
  CleanerProfile: { cleanerId: number };
  PickTime: {
    cleanerId: number;
    cleanerName: string;
    serviceId: number;
    serviceTitle: string;
    hourlyRate: string;
  };
  Summary: {
    cleanerId: number;
    cleanerName: string;
    serviceId: number;
    serviceTitle: string;
    hourlyRate: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  Done: undefined;
  BookingDetail: { bookingId: number };
  RequestDetail: { bookingId: number };
  Review: { bookingId: number; cleanerName: string };
  Chat: { bookingId: number; title: string };
  MyServices: undefined;
};
