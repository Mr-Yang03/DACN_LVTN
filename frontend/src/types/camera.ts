// export interface Camera {
//     _id: string;
//     DisplayName: string;
//     SnapshotUrl?: string;
//     location: {
//       type: "Point";
//       coordinates: [number, number]; // [longitude, latitude]
//     };
//     Status?: "online" | "offline" | "error";
//   }
  
export interface Camera {
  _id: string;
  Title: string;
  Code: string;
  Location: {
    type: "Point";
    coordinates: [number, number];
  };
  SnapshotUrl: string | null;
  CamType: string;
  Publish: "True" | "False";
  ManagementUnit: string | null;
  CamStatus: string;
  PTZ: "True" | "False";
  Angle: number;
  DisplayName: string;
  VideoUrl: string | null;
  VideoStreaming: number;
  DataId: string | null;
  NodeId: string;
  Path: string;
  CreatedDate: string;
  ModifiedDate: string;
  DynamicProperties: unknown[];  // Thay thế any[] bằng unknown[]
  District: string | null;
}
