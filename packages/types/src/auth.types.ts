import { AuthTypes } from "./database.types";

export { AuthTypes };

export interface Auth {
  id: string;
  
  profile_id: string;
  service_id: string;
  
  access_token: string;
  refresh_token: string;
  
  created_at: string;
  type: AuthTypes;
};